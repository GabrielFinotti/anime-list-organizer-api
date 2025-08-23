# Anime List Organizer API

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E=18.x-green)
![TypeScript](https://img.shields.io/badge/types-TypeScript-informational)
![License](https://img.shields.io/badge/license-Apache%202.0-orange)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Issues](https://img.shields.io/github/issues/GabrielFinotti/anime-list-organizer-api)
![Last Commit](https://img.shields.io/github/last-commit/GabrielFinotti/anime-list-organizer-api)

API REST para gerenciamento e organização de animes com lookup inteligente via OpenAI.

[Reportar Bug](https://github.com/GabrielFinotti/anime-list-organizer-api/issues) · [Solicitar Feature](https://github.com/GabrielFinotti/anime-list-organizer-api/issues)

## ✨ Visão Geral

Esta API permite criar, atualizar, listar e remover animes do seu catálogo pessoal, além de realizar consultas automáticas (lookup) que retornam metadados normalizados usando o modelo da OpenAI. Ela aplica validação forte com Zod, persistência em MongoDB e autenticação Basic simples para proteção dos endpoints.

## 🧱 Stack Principal

- Node.js + Express 5
- TypeScript
- MongoDB (Mongoose)
- Zod (validação de schema)
- OpenAI SDK

## 🗂 Arquitetura (Camadas)

```text
src/
 application/      (casos de uso / orquestração de regras)
 domain/           (entidades, schemas de validação)
 infrastructure/   (adapters: http, database, api externa OpenAI)
 server.ts         (bootstrap + wiring)
```

Padrão inspirado em Clean / Hexagonal: controllers chamam use-cases; use-cases usam repositórios (interface) que acessam models Mongoose.

## 🔐 Autenticação

Todos os endpoints (prefixo `/api/{VERSION}`) exigem Basic Auth.

Header:

```text
Authorization: Basic base64(BASIC_AUTH_USER:BASIC_AUTH_PASSWORD)
```

Se ausente ou inválido: 401 com corpo padronizado.

## 📦 Formato de Resposta

Todas as respostas seguem:

```json
{
 "success": true,
 "statusCode": 200,
 "message": "Descrição",
 "data": {}
}
```

Em erro: `success: false` e `data` pode ser `null`.

## 🧪 Status Codes Principais

- 200 OK / 201 Created (não há 201 hoje, mas pode ser adotado em criação)
- 400 Requisição inválida (payload ou query incorretos)
- 401 Não autenticado
- 404 Registro não encontrado
- 409 Conflito (ex.: nome duplicado) – se implementado no repositório
- 500 Erro interno

## ⚙️ Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `PORT` | ✅ | Porta do servidor Express |
| `MONGODB_URI` | ✅ | String de conexão MongoDB |
| `BASIC_AUTH_USER` | ✅ | Usuário Basic Auth |
| `BASIC_AUTH_PASSWORD` | ✅ | Senha Basic Auth |
| `OPENAI_API_KEY` | ✅ (para lookup) | Chave da API OpenAI |
| `VERSION` | ❌ (default v1) | Versão exposta no prefixo da API |

Exemplo `.env`:

```env
PORT=3333
MONGODB_URI=mongodb://localhost:27017
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=admin123
OPENAI_API_KEY=sk-xxxxx
VERSION=v1
```

## 🚀 Execução Local

1.Clonar repositório
2.Criar `.env` (ver acima)
3.Instalar dependências

 ```bash
 npm install
 ```

4.Ambiente de desenvolvimento (watch):

 ```bash
 npm run dev
 ```

5.Build + produção:

 ```bash
 npm run build
 npm start
 ```

Aplicação sobe em: `http://localhost:PORT/api/v1` (se `VERSION=v1`).

## 📜 Scripts NPM

| Script | Descrição |
|--------|-----------|
| `dev` | Execução com hot-reload (tsx) |
| `build` | Gera artefatos em `dist/` via tsup |
| `start` | Executa build gerado (`node dist/server.js`) |
| `typecheck` | Verificação de tipos TypeScript |

## 📘 Modelo de Dados (Anime)

Campos principais (criação):

```json
{
 "name": "string",
 "synopsis": "string",
 "category": "string (demografia: shounen | seinen | ...)",
 "genres": ["string", "string"],
 "typeOfMaterialOrigin": "string",
 "materialOriginName": "string",
 "releaseDate": "YYYY-MM-DD",
 "isAMovie": true,
 "derivates": { "movies": [""], "ova": [""], "specials": ["" ] } | null,
 "lastReleaseSeason": 1,
 "lastWatchedSeason": 1,
 "lastWatchedEpisode": 12,
 "status": "watching|completed|dropped|in list"
}
```

Atualização: todos os campos parciais (opcionais) – schema `partial()`.

## 🔎 Lookup de Anime (OpenAI)

Endpoint realiza busca sem persistir, retornando metadados normalizados. Modelo usado: `gpt-5-mini` com ferramenta de web search.

## 🔗 Endpoints

Prefixo: `/api/{VERSION}` (ex.: `/api/v1`). Todos exigem Basic Auth.

### Listar todos

`GET /animes`

Resposta 200:

```json
{
 "success": true,
 "statusCode": 200,
 "message": "...",
 "data": [ { "_id": "...", "name": "..." } ]
}
```

### Obter por ID

`GET /animes/{id}` – Erros: 400 se ObjectId inválido, 404 se não encontrado.

### Criar

`POST /animes` – Body conforme modelo de criação. Campos obrigatórios: todos exceto `derivates` / campos `last*`.

### Atualizar

`PUT /animes/{id}` – Body parcial.

### Remover por ID

`DELETE /animes/{id}`

### Remover todos

`DELETE /animes` – Operação destrutiva.

### Lookup (não persiste)

`GET /anime/lookup?name={termo}` – `name` string com mínimo 5 chars.

## 🧩 Padrões e Decisões

- Validação de entrada: Zod no domínio garante integridade.
- Respostas uniformes via `ApiResponse`.
- Basic Auth simples para uso interno / MVP (avaliar JWT/OAuth futuramente se expor publicamente).
- Separação de camadas facilita testes e substituição de provedores (ex.: outro LLM).

## 🛡 Boas Práticas Futuras / Roadmap

- Adicionar testes unitários e de integração.
- Implementar paginação em `GET /animes`.
- Suporte a filtros (status, categoria, gênero).
- Cache para resultados de lookup.
- Rate limiting / proteção contra abuso.
- Observabilidade (p.ex. pino + métricas Prometheus).
- Dockerfile + Compose (Mongo + API).
- Retornar 201 em criação com header `Location`.

## 🤝 Contribuindo

1. Fork
2. Criar branch feature: `feat/descricao`
3. Commit semântico: `feat: adicionar filtro por status`
4. Abrir PR descrevendo mudanças e passos de teste

## 📄 Licença

Distribuído sob a licença **Apache 2.0**. Consulte o arquivo `LICENSE`.

---

Made with ☕ por contribuidores. Sugestões e PRs são bem-vindos.
