import { GenreInput } from '../../../../application/services/lookupAnime.service.js';

const buildPrompt = (
  title: string,
  availableCategories: string[],
  availableGenres: GenreInput[],
): string => {
  const animeTypes = ['serie', 'movie', 'mixed'] as const;
  const productionTypes = ['original', 'adaptation'] as const;
  const typeOfMaterialOrigins = [
    'manga',
    'light_novel',
    'visual_novel',
    'game',
    'other',
    'none',
  ] as const;

  const genreNames = availableGenres.map((g) => g.name);
  const adultGenres = availableGenres.filter((g) => g.isAdultContent).map((g) => g.name);

  return `Você é um assistente que devolve apenas JSON válido, sem markdown nem texto extra. Responda em português. Use a ferramenta de pesquisa na web para dados mais recentes; se não encontrar informação confiável, preencha campos vazios conforme regras.

Dados fornecidos:
- Título: "${title}"
- Categorias permitidas: ${JSON.stringify(availableCategories, null, 2)}
- Gêneros permitidos: ${JSON.stringify(genreNames, null, 2)}
- Gêneros adultos: ${JSON.stringify(adultGenres, null, 2)}
- animeType: ${JSON.stringify(animeTypes, null, 2)}
- productionType: ${JSON.stringify(productionTypes, null, 2)}
- typeOfMaterialOrigin: ${JSON.stringify(typeOfMaterialOrigins, null, 2)}

Retorne exatamente:
{
  "anime": {
    "name": "string",
    "synopsis": "string (50-500 chars, pt-BR)",
    "category": "string",
    "genres": ["string"],
    "animeType": "serie | movie | mixed",
    "productionType": "original | adaptation",
    "typeOfMaterialOrigin": "manga | light_novel | visual_novel | game | other | none",
    "movies": [{ "title": "string", "releaseDate": "YYYY-MM-DD" }],
    "seasons": [{ "seasonNumber": number, "releaseDate": "YYYY-MM-DD", "totalEpisodes": number }],
    "isAdultContent": boolean
  },
  "observedDetails": ["string"]
}

Regras (siga em ordem):
1) name: corrija o nome oficial se necessário.
2) synopsis: 50-500 caracteres em pt-BR.
3) category: escolha apenas entre as categorias permitidas; se nenhuma servir, use "".
4) genres: use somente gêneros permitidos, adicione o máximo possível; se nenhum, use [].
5) animeType:
   - "serie": movies=[] e seasons length>=1
   - "movie": seasons=[] e movies length>=1
   - "mixed": movies length>=1 e seasons length>=1
6) productionType: escolha um dos permitidos.
7) typeOfMaterialOrigin: escolha um dos permitidos; so use o "none" se o productionType for "original"; Para material desconhecido use "".
8) movies/seasons: se não houver dados confiáveis, use [].
9) isAdultContent: true se qualquer gênero selecionado estiver na lista adulta; senão false.
10) Campos ausentes: strings -> "", arrays -> [], boolean -> false, números -> 0.
11) Datas: sempre "YYYY-MM-DD"; se desconhecida, use "".
12) Não invente links nem fontes; use apenas dados encontrados ou deixe vazio conforme regras.
13) Para dados parcialmente encontrados, preencha o que souber.
14) Para os campos parcialmente preenchidos ou vazios, liste somente o nome do campo em observedDetails.
15) Não adicione dados extras como fonte de pesquisa ou avisos, somente os dados solicitados no JSON.
16) Checklist final antes de responder: validar (a) animeType x movies/seasons, (b) uso apenas de categorias/gêneros fornecidos, (c) isAdultContent coerente com gêneros.

Retorne somente o JSON.`;
};

export default buildPrompt;
