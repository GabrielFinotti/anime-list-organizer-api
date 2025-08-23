import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15 * 60 * 1000,
});

const buildPrompt = (animeName: string) => {
  return `Você é um assistente especialista em catalogar animes. A tarefa: retornar EXCLUSIVAMENTE um JSON válido que siga exatamente o schema abaixo (sem campos extras / sem comentários) e com valores adequados. NÃO inclua explicações, texto extra ou markdown. NÃO invente informações: se não tiver certeza absoluta, siga as regras de fallback. Consulta (possivelmente com erros de digitação): "${animeName}"\n\nSchema (chaves e tipos obrigatórios na criação): { "name": string, "synopsis": string, "category": string, "genres": string[], "typeOfMaterialOrigin": string, "materialOriginName": string, "releaseDate": string (formato ISO YYYY-MM-DD), "isAMovie": boolean, "derivates": { "movies": string[], "ova": string[], "specials": string[] } | null, "lastReleaseSeason": number | null }\n\nRegras e consistência:\n1. Se isAMovie = true então lastReleaseSeason = null e derivates podem existir (se houver derivados confirmados).\n2. derivates:\n   2.1. Se NÃO houver NENHUM derivado confirmado (filme, ova ou especial) usar null.\n   2.2. Se houver AO MENOS UM derivado confirmado, retornar o objeto completo { movies, ova, specials }.\n   2.3. Para cada categoria sem itens confirmados, usar array vazio.\n   2.4. NÃO inventar títulos; incluir apenas títulos oficiais.\n   2.5. Não repetir títulos; manter ordem cronológica aproximada se conhecida.\n3. releaseDate: primeira data oficial de estreia (YYYY-MM-DD). Se só mês/ano conhecido usar YYYY-MM-01. Se só ano conhecido usar YYYY-01-01. Se totalmente desconhecida usar 1900-01-01.\n4. Strings desconhecidas: exatamente "Dados não encontrados".\n5. genres: lista (array) de gêneros/etiquetas (narrativos OU específicos de anime) em lowercase livre (singular ou plural aceito). Exemplos: "ação", "aventura", "drama", "comédia", "fantasia", "sci-fi", "terror", "psicológico", "romance", "mecha", "ecchi", "slice of life", "isekai", "esporte", "mistério", "thriller", "sobrenatural". Remover duplicados. Mínimo 3; se desconhecido usar ["Dados não encontrados"].\n6. category: DEMOGRAFIA principal (ex: "shounen", "seinen", "shoujo", "josei", "kodomo"). Nunca colocar aqui gêneros narrativos ou etiquetas como ação, fantasia, romance, mecha, slice of life, ecchi, terror, drama, etc. Se múltiplas demografias plausíveis forem citadas (ex.: dúvidas entre shounen e seinen), escolher UMA única que melhor reflete o público editorial/alvo predominante (revista de publicação, tom, idade dos protagonistas). Só usar "Dados não encontrados" se realmente impossível inferir.\n7. typeOfMaterialOrigin exemplos: "Manga", "Light Novel", "Web Novel", "Visual Novel", "Game", "Original". Se duvidoso usar "Dados não encontrados".\n8. materialOriginName: se typeOfMaterialOrigin = "Original" usar o título oficial correto (corrigido de qualquer erro de digitação da consulta). Caso não seja original e não tiver certeza do nome da obra de origem usar "Dados não encontrados".\n9. Não inclua campo id.\n10. Saída deve ser JSON puro sem comentários / sem markdown.\n11. Nunca usar "N/A" ou "Unknown" — somente "Dados não encontrados" ou null conforme regras.\n12. Não extrapole além do pedido (apenas o JSON).\n13. name: deve ser o título oficial correto da obra (corrigir erros de digitação do termo consultado; usar romanização ou título internacional amplamente aceito).\n14. Corrigir quaisquer typos no título de entrada antes de preencher name e (se aplicável) materialOriginName. Não preservar grafias incorretas.\n15. Use APENAS seu conhecimento interno sempre que tiver alta confiança.\n16. Se QUALQUER campo essencial (name, synopsis, category, releaseDate, typeOfMaterialOrigin, materialOriginName, derivates) estiver incerto, incompleto, contraditório ou exigir confirmação atualizada: você DEVE (antes de montar a resposta final) realizar buscas com a ferramenta web_search_preview para confirmar e só então responder.\nAgora gere somente o JSON para a consulta. `;
};

const prompt = buildPrompt("darlin in the franx".trim());

const animeLookup = async () => {
  try {
    const result = await client.responses.create({
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

    console.log(result);
  } catch (error) {
    console.error("Error fetching anime information:", error);
  }
};

export default animeLookup;
