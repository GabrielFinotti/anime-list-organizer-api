import OpenAI from "openai";
import dotenv from "dotenv";
import buildPrompt from "./buildPrompt";

dotenv.config();

export type IAnimeLookup = {
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: string;
  isAMovie: boolean;
  derivates: {
    movies: string[];
    ova: string[];
    specials: string[];
  } | null;
  lastReleaseSeason: number | null;
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

      const derivatesRaw = (parsed as any).derivates;
      let derivates: IAnimeLookup["derivates"] = null;

      if (derivatesRaw && typeof derivatesRaw === "object") {
        const movies = arrString(derivatesRaw.movies);
        const ova = arrString(derivatesRaw.ova);
        const specials = arrString(derivatesRaw.specials);

        if (movies.length || ova.length || specials.length)
          derivates = { movies, ova, specials };
      }

      const genres = arrString((parsed as any).genres).map((g) =>
        g.toLowerCase()
      );

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
          : null;

      return {
        name: safeString((parsed as any).name),
        synopsis: safeString((parsed as any).synopsis),
        category: safeString((parsed as any).category),
        genres: genres.length ? genres : ["Dados não encontrados"],
        typeOfMaterialOrigin: safeString((parsed as any).typeOfMaterialOrigin),
        materialOriginName: safeString((parsed as any).materialOriginName),
        releaseDate,
        isAMovie: Boolean((parsed as any).isAMovie),
        derivates,
        lastReleaseSeason,
      };
    } catch {
      return null;
    }
  }

  async lookup(title: string): Promise<IAnimeLookup | null> {
    const prompt = buildPrompt(title.trim());

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
