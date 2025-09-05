import OpenAI from "openai";
import dotenv from "dotenv";
import buildPrompt from "./buildPrompt";
import GenreService from "../../service/genre.service";
import CategoryService from "../../service/category.service";
import AdultGenreService from "../../service/adultGenre.service";

dotenv.config();

export type IAnimeLookup = {
  name: string;
  synopsis: string;
  category: {
    name: string;
  };
  genres: {
    name: string;
  }[];
  adultGenres: {
    name: string;
  }[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: string;
  isMovie: boolean;
  isAdult: boolean;
  derivate?: {
    movies: string[];
    ovas: string[];
    specials: string[];
  };
  lastReleaseSeason: number;
  actualStatus: string;
};

class AnimeLookupService {
  private client: OpenAI;

  constructor(apiKey: string | undefined = process.env.OPENAI_API_KEY) {
    if (!apiKey) {
      throw new Error("Chave de api necessária para prosseguir!");
    }

    this.client = new OpenAI({
      apiKey,
      timeout: 15 * 60 * 1000,
    });
  }

  private extractJson(raw: string) {
    if (!raw) return null;

    const start = raw.indexOf("{");

    if (start === -1) return null;

    let depth = 0;

    for (let i = start; i < raw.length; i++) {
      const ch = raw[i];

      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;

        if (depth === 0) return raw.slice(start, i + 1);
      }
    }
    return null;
  }

  private parseLookup(jsonText: string) {
    try {
      const parsed = JSON.parse(jsonText);

      if (typeof parsed !== "object" || parsed === null) return null;

      const safeString = (v: any): string =>
        typeof v === "string" && v.trim() !== ""
          ? v.trim()
          : "Dados não encontrados";

      const parseNameArray = (arr: any): { name: string }[] => {
        if (!Array.isArray(arr)) return [];
        return arr
          .map((item) => {
            if (typeof item === "string" && item.trim() !== "") {
              return { name: item.trim() };
            }
            if (
              item &&
              typeof item === "object" &&
              typeof item.name === "string" &&
              item.name.trim() !== ""
            ) {
              return { name: item.name.trim() };
            }
            return null;
          })
          .filter((v): v is { name: string } => v !== null);
      };

      const arrString = (v: any): string[] =>
        Array.isArray(v)
          ? [
              ...new Set(
                v
                  .filter((i) => typeof i === "string")
                  .map((s) => s.trim())
                  .filter(Boolean)
              ),
            ]
          : [];

      const derivateRaw = (parsed as any).derivate;
      let derivate: IAnimeLookup["derivate"];

      if (derivateRaw && typeof derivateRaw === "object") {
        const movies = arrString(derivateRaw.movies);
        const ovas = arrString(derivateRaw.ovas);
        const specials = arrString(derivateRaw.specials);

        if (movies.length || ovas.length || specials.length) {
          derivate = { movies, ovas, specials };
        }
      }

      const genres = parseNameArray((parsed as any).genres);
      const adultGenres = parseNameArray((parsed as any).adultGenres);

      const categoryRaw = (parsed as any).category;
      const category =
        categoryRaw &&
        typeof categoryRaw === "object" &&
        typeof categoryRaw.name === "string" &&
        categoryRaw.name.trim() !== ""
          ? { name: categoryRaw.name.trim() }
          : { name: "Dados não encontrados" };

      const releaseDateRaw = (parsed as any).releaseDate;
      const fallbackDateStr = "1900-01-01";
      const toDateStr = (d: Date) =>
        isNaN(d.getTime()) ? fallbackDateStr : d.toISOString().slice(0, 10);
      let releaseDate: string;

      if (releaseDateRaw instanceof Date) {
        releaseDate = toDateStr(releaseDateRaw);
      } else if (typeof releaseDateRaw === "string") {
        const candidate = new Date(releaseDateRaw.trim());
        releaseDate = toDateStr(candidate);
      } else if (
        typeof releaseDateRaw === "number" &&
        Number.isFinite(releaseDateRaw)
      ) {
        const candidate = new Date(releaseDateRaw);
        releaseDate = toDateStr(candidate);
      } else {
        releaseDate = fallbackDateStr;
      }

      const lastReleaseSeasonRaw = (parsed as any).lastReleaseSeason;
      const lastReleaseSeason =
        typeof lastReleaseSeasonRaw === "number" &&
        Number.isFinite(lastReleaseSeasonRaw)
          ? lastReleaseSeasonRaw
          : 0;

      return {
        name: safeString((parsed as any).name),
        synopsis: safeString((parsed as any).synopsis),
        category,
        genres: genres.length ? genres : [{ name: "Dados não encontrados" }],
        adultGenres: adultGenres.length ? adultGenres : [],
        typeOfMaterialOrigin: safeString((parsed as any).typeOfMaterialOrigin),
        materialOriginName: safeString((parsed as any).materialOriginName),
        releaseDate,
        isMovie: Boolean((parsed as any).isMovie),
        isAdult: Boolean((parsed as any).isAdult),
        ...(derivate && { derivate }),
        lastReleaseSeason,
        actualStatus: safeString((parsed as any).actualStatus),
      };
    } catch {
      return null;
    }
  }

  async lookup(title: string): Promise<IAnimeLookup | null> {
    const genreService = new GenreService();
    const categoryService = new CategoryService();
    const adultGenreService = new AdultGenreService();

    const [genres, categories, adultGenres] = await Promise.all([
      genreService.getAllGenres(),
      categoryService.getAllCategories(),
      adultGenreService.getAllAdultGenres(),
    ]);

    const availableGenres = genres ? genres.map((g) => g.name) : [];
    const availableCategories = categories ? categories.map((c) => c.name) : [];
    const availableAdultGenres = adultGenres
      ? adultGenres.map((ag) => ag.name)
      : [];
    const availableStatuses = [
      "publishing",
      "completed",
      "cancelled",
      "in production",
    ];

    const prompt = buildPrompt(
      title.trim(),
      availableGenres,
      availableCategories,
      availableAdultGenres,
      availableStatuses
    );

    const lookup = await this.client.responses.create({
      model: "gpt-5-mini",
      tools: [
        {
          type: "web_search_preview",
          search_context_size: "medium",
        },
      ],
      input: [
        {
          role: "system",
          content:
            "Você é um assistente que ajuda a encontrar informações sobre animes. Responda com base nos dados disponíveis e SOMENTE em JSON VÁLIDO!",
        },
        { role: "user", content: prompt },
      ],
      service_tier: "flex",
    });

    const raw = lookup.output_text;
    const jsonText = this.extractJson(raw);

    if (!jsonText) return null;

    return this.parseLookup(jsonText);
  }
}

export default AnimeLookupService;
