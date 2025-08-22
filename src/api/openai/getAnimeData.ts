import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 900000,
});

export interface AnimeGeneratedData {
  title: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: string;
  isAMovie: boolean;
  isSerieContentAnyDerivativeMovie: boolean;
  isSerieContentAnyDerivativeOva: boolean;
  isSerieContentAnyDerivativeSpecial: boolean;
  moviesOrOvasOrSpecialsNames: string[] | null;
  lastReleaseSeason: number | null;
  lastWatchedSeason: null;
  lastWatchedEpisode: null;
}

const buildPrompt = (animeName: string) =>
  `Você é um assistente especialista em catalogar animes. A tarefa: retornar EXCLUSIVAMENTE um JSON válido com dados sobre um anime. NÃO inclua explicações, texto extra ou markdown. NÃO invente informações: se não tiver certeza absoluta, siga as regras de fallback. Consulta: ${animeName}\nCampos a produzir (sem campos extras): { "title": string, "synopsis": string, "category": string, "genres": string[], "typeOfMaterialOrigin": string, "materialOriginName": string, "releaseDate": string (dd/MM/yyyy), "isAMovie": boolean, "isSerieContentAnyDerivativeMovie": boolean, "isSerieContentAnyDerivativeOva": boolean, "isSerieContentAnyDerivativeSpecial": boolean, "moviesOrOvasOrSpecialsNames": string[] | null, "lastReleaseSeason": number | null, "lastWatchedSeason": null, "lastWatchedEpisode": null }\nRegras e consistência:\n1. Nunca preencha lastWatchedSeason ou lastWatchedEpisode (devem ser sempre null).\n2. Se isAMovie = true então lastReleaseSeason = null e todos os campos lastWatched* = null.\n3. Se qualquer flag de derivado (…DerivativeMovie/Ova/Special) for true, liste TODOS os títulos oficiais correspondentes em moviesOrOvasOrSpecialsNames; se nenhuma flag for true use null.\n4. Não invente obras derivadas inexistentes.\n5. releaseDate: use a primeira data oficial de estreia no Japão (ou país de origem). Se dia exato desconhecido mas mês/ano conhecido use “01/MM/AAAA”. Se só o ano conhecido use “01/01/AAAA”. Se totalmente desconhecida use “01/01/1900”.\n6. Campos string desconhecidos: usar exatamente "Dados não encontrados".\n7. Campos que aceitam null (moviesOrOvasOrSpecialsNames, lastReleaseSeason) devem ser null se desconhecidos.\n8. genres: mínimo 1 gênero; se incerto coloque ["Dados não encontrados"].\n9. category: usar a melhor que se enquadrar na demografia do publico alvo; se não souber use "Dados não encontrados".\n10. typeOfMaterialOrigin exemplos válidos: "Manga", "Light Novel", "Web Novel", "Visual Novel", "Game", "Original". Se duvidoso usar "Dados não encontrados".\n11. materialOriginName: se typeOfMaterialOrigin = "Original" usar ${animeName} (a menos que exista nome formal).\n12. Não inclua campo id.\n13. Saída deve ser JSON puro sem comentários.\n14. Nunca use "N/A" ou "Unknown" — somente "Dados não encontrados" ou null conforme regra.\n15. Não extrapole além do pedido (apenas o JSON).\nAgora gere somente o JSON para a consulta.`;

export async function getAnimeDataByName(
  animeName: string
): Promise<AnimeGeneratedData> {
  if (!animeName || !animeName.trim()) {
    throw new Error("Nome do anime é obrigatório");
  }

  const prompt = buildPrompt(animeName.trim());
  const model = "gpt-5-mini";

  let response;
  try {
    response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Você responde apenas com JSON válido." },
        { role: "user", content: prompt },
      ],
      temperature: 0.0,
      service_tier: "flex",
    });
  } catch (err: any) {
    const msg = (err?.message || "").toLowerCase();
    const status = err?.status || err?.code;

    if (status === 429 && msg.includes("quota")) {
      const quotaErr = new Error(
        "Limite de uso/quota da OpenAI excedido. Verifique seu plano e billing."
      );

      (quotaErr as any).name = "OpenAIQuotaExceededError";

      throw quotaErr;
    }
    if (status === 429) {
      const rateErr = new Error(
        "Taxa de requisições à OpenAI excedida (rate limit). Tente novamente em instantes."
      );

      (rateErr as any).name = "OpenAIRateLimitError";
      
      throw rateErr;
    }
    throw err;
  }

  const raw = response.choices?.[0]?.message?.content?.trim();

  if (!raw) throw new Error("Resposta vazia da OpenAI");

  let jsonText = raw;

  if (jsonText.startsWith("```")) {
    jsonText = jsonText
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  try {
    const parsed = JSON.parse(jsonText);

    return parsed as AnimeGeneratedData;
  } catch (e) {
    throw new Error("Falha ao parsear JSON retornado: " + (e as Error).message);
  }
}

export default getAnimeDataByName;
