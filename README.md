# Anime List Organizer API

![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E=18.x-green)
![TypeScript](https://img.shields.io/badge/types-TypeScript-informational)
![License](https://img.shields.io/badge/license-Apache%202.0-orange)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Issues](https://img.shields.io/github/issues/GabrielFinotti/anime-list-organizer-api)
![Last Commit](https://img.shields.io/github/last-commit/GabrielFinotti/anime-list-organizer-api)

API REST para gerenciamento e organização de animes, com lookup inteligente via OpenAI e suporte a categorias, gêneros e gêneros adultos.

[Reportar Bug](https://github.com/GabrielFinotti/anime-list-organizer-api/issues) · [Solicitar Feature](https://github.com/GabrielFinotti/anime-list-organizer-api/issues)

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Modelos de Dados](#modelos-de-dados)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Scripts](#scripts)
- [Docker](#docker)
- [Contribuição](#contribuição)
- [Licença](#licença)

## ✨ Visão Geral

Esta API permite criar, atualizar, listar e remover animes do seu catálogo pessoal, além de realizar consultas automáticas (lookup) que retornam metadados normalizados usando o modelo GPT-4o-mini da OpenAI com ferramenta de busca web. Suporta organização por categorias, gêneros e gêneros adultos, facilitando a catalogação e descoberta de conteúdo.

## 🧱 Stack Tecnológico

- **Node.js** (>= 18.x)
- **Express.js** (Framework web)
- **TypeScript** (Tipagem estática)
- **MongoDB** (Banco de dados NoSQL)
- **Mongoose** (ODM para MongoDB)
- **OpenAI SDK** (Integração com IA para lookup)
- **Zod** (Validação de schemas - preparado para uso futuro)
- **jsonwebtoken** (Preparado para autenticação JWT futura)

## 🗂 Arquitetura

A API segue o padrão MVC (Model-View-Controller) com separação clara de responsabilidades:

```
src/
├── controller/     # Controladores HTTP (manipulam requests/responses)
├── service/        # Lógica de negócio e orquestração
├── repository/     # Abstração de acesso a dados
├── model/          # Schemas Mongoose e entidades
├── router/         # Definição de rotas
├── middleware/     # Middlewares Express (ex.: autenticação básica)
├── api/
│   └── openai/     # Integração com OpenAI para lookup
├── interface/
│   ├── dto/        # Data Transfer Objects
│   └── repository/ # Interfaces de repositório
├── utils/          # Utilitários diversos
└── server.ts       # Ponto de entrada da aplicação
```

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 18.x
- MongoDB (local ou Atlas)
- Conta OpenAI com API Key

### Passos

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/GabrielFinotti/anime-list-organizer-api.git
   cd anime-list-organizer-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (veja seção [Configuração](#-configuração))

4. **Execute em desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Ou build e execute em produção:**

   ```bash
   npm run build
   npm start
   ```

A aplicação estará disponível em `http://localhost:{PORT}/api/v3`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `PORT` | ✅ | Porta do servidor Express | `3333` |
| `MONGODB_URI` | ✅ | String de conexão MongoDB | `mongodb://localhost:27017/anime-db` |
| `OPENAI_API_KEY` | ✅ | Chave da API OpenAI | `sk-xxxxx` |
| `BASIC_USERNAME` | ✅ | Nome de usuário para Basic Auth | `admin` |
| `BASIC_PASSWORD` | ✅ | Senha para Basic Auth | `password123` |
| `VERSION` | ❌ | Versão da API (padrão: v3) | `v3` |

**Exemplo de `.env`:**

```env
PORT=3333
MONGODB_URI=mongodb://localhost:27017/anime-list-organizer
OPENAI_API_KEY=sk-your-openai-api-key-here
BASIC_USERNAME=admin
BASIC_PASSWORD=password123
VERSION=v3
```

### MongoDB

Certifique-se de que o MongoDB esteja rodando localmente ou configure uma conexão com MongoDB Atlas.

## 📖 Uso

### Formato de Resposta

Todas as respostas seguem o padrão consistente:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

Em caso de erro:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descrição do erro",
  "data": null
}
```

### Códigos de Status

- `200` - OK (operações bem-sucedidas)
- `201` - Created (criação de recursos)
- `400` - Bad Request (dados inválidos)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (conflito, ex.: nome duplicado)
- `500` - Internal Server Error (erro interno)

## 📊 Modelos de Dados

### Anime

```typescript
{
  id?: string;
  name: string;                    // Nome do anime
  synopsis: string;                // Sinopse
  category: CategoryDTO;           // Categoria (ex.: Shounen)
  genres: GenreDTO[];              // Lista de gêneros
  adultGenres: AdultGenreDTO[];    // Lista de gêneros adultos (opcional)
  typeOfMaterialOrigin: string;    // Origem (ex.: Manga, Light Novel)
  materialOriginName: string;      // Nome da obra original
  releaseDate: string;             // Data de lançamento (YYYY-MM-DD)
  isMovie: boolean;                // É um filme?
  isAdult: boolean;                // Conteúdo adulto?
  derivate?: {                     // Derivados (opcional)
    movies: string[];
    ovas: string[];
    specials: string[];
  };
  lastReleaseSeason: number;       // Última temporada lançada
  lastWatchedSeason: number;       // Última temporada assistida
  lastWatchedEpisode: number;      // Último episódio assistido
  actualStatus: "publishing" | "completed" | "cancelled" | "in production";
  status: "watching" | "completed" | "in list" | "dropped";
}
```

### Category

```typescript
{
  id?: string;
  name: string;              // Nome da categoria
  translatedName: string;    // Nome traduzido
  targetAudience: string;    // Público-alvo
  characteristics: string[]; // Características
}
```

### Genre

```typescript
{
  id?: string;
  name: string;              // Nome do gênero
  characteristics: string[]; // Características
}
```

### AdultGenre

```typescript
{
  id?: string;
  name: string;              // Nome do gênero adulto
  characteristics: string[]; // Características
}
```

## 🔗 Endpoints

**Prefixo base:** `/api/v3`

### Animes

#### Listar todos os animes

`GET /animes`

**Query Parameters (opcionais):**

- `name`: Filtrar por nome
- `category`: Filtrar por categoria
- `genre`: Filtrar por gênero

**Resposta 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Animes retrieved successfully",
  "data": [...]
}
```

#### Obter anime por ID

`GET /animes/{id}`

**Erros:** 400 (ID inválido), 404 (não encontrado)

#### Buscar por categoria

`GET /animes/category/{categoryName}`

#### Buscar por gênero

`GET /animes/genre/{genreName}`

#### Buscar por gênero adulto

`GET /animes/adult-genre/{adultGenreName}`

#### Criar anime

`POST /animes`

**Body:** Objeto AnimeDTO (ver [Modelos de Dados](#-modelos-de-dados))

**Resposta 201:** Anime criado

#### Atualizar anime

`PUT /anime/update/{id}`

**Body:** Objeto AnimeDTO parcial

#### Remover anime por ID

`DELETE /anime/delete/{id}`

#### Remover todos os animes

`DELETE /animes/delete-all`

### Categorias

#### Listar todas

`GET /categories`

#### Criar categoria (Admin)

`POST /category`

**Body:** Objeto CategoryDTO

#### Remover categoria (Admin)

`DELETE /category/{id}`

### Gêneros

#### Listar todos

`GET /genres`

#### Criar gênero (Admin)

`POST /genre`

**Body:** Objeto GenreDTO

#### Remover gênero (Admin)

`DELETE /genre/{id}`

### Gêneros Adultos

#### Listar todos

`GET /adult-genres`

#### Criar gênero adulto (Admin)

`POST /adult-genre`

**Body:** Objeto AdultGenreDTO

#### Remover gênero adulto (Admin)

`DELETE /adult-genre/{id}`

### Lookup (OpenAI)

#### Buscar metadados de anime

`GET /anime/lookup?title={nome}`

**Parâmetros:**

- `title`: Nome do anime (obrigatório, mínimo 1 caractere)

**Resposta 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dados do anime encontrados com sucesso",
  "data": {
    "name": "Nome Oficial",
    "synopsis": "Sinopse em português",
    "category": { "name": "Categoria" },
    "genres": [{ "name": "Gênero1" }],
    "adultGenres": [],
    // ... outros campos
  }
}
```

Este endpoint utiliza GPT-5-mini com busca web para obter metadados precisos e normalizados.

## 🔐 Autenticação

A API utiliza autenticação básica (Basic Auth) para proteger os endpoints da versão v3. Todas as requisições para `/api/v3` devem incluir o header `Authorization` com credenciais codificadas em Base64.

### Como usar

1. Codifique suas credenciais em Base64: `username:password` (ex.: `admin:password123`)
2. Inclua no header: `Authorization: Basic <base64-encoded-credentials>`

**Exemplo com curl:**

```bash
curl -H "Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=" http://localhost:3333/api/v3/animes
```

### Configuração

Adicione as seguintes variáveis ao seu `.env`:

- `BASIC_USERNAME`: Nome de usuário para autenticação
- `BASIC_PASSWORD`: Senha para autenticação

**Nota:** Em produção, use HTTPS para proteger as credenciais durante a transmissão.

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Executa em modo desenvolvimento com hot-reload (tsx) |
| `npm run build` | Gera build otimizado em `dist/` via tsup |
| `npm start` | Executa build gerado (`node dist/server.js`) |
| `npm run typecheck` | Verifica tipos TypeScript |

## 🧩 Padrões e Decisões

- **Validação:** Preparado para usar Zod em DTOs e schemas
- **Respostas consistentes:** Padrão uniforme em todas as respostas
- **Separação de camadas:** MVC facilita manutenção e testes
- **Lookup inteligente:** OpenAI com busca web para metadados precisos
- **Normalização:** Dados retornados em português brasileiro
- **Índices:** Campos críticos indexados no MongoDB
- **Referências:** Uso de ObjectIds para relacionamentos

## 🛡 Roadmap

- ✅ CRUD completo para animes
- ✅ Lookup via OpenAI
- ✅ Suporte a categorias, gêneros e gêneros adultos
- ✅ Implementar autenticação (Basic Auth)
- 🔄 Docker e Compose
- 🔄 Adicionar testes unitários e integração
- 🔄 Implementar paginação e filtros avançados
- 🔄 Cache para resultados de lookup (Redis)
- 🔄 Rate limiting e proteção contra abuso
- 🔄 Observabilidade (logs, métricas)
- 🔄 Docker e Compose
- 🔄 Documentação interativa (Swagger)
- 🔄 Endpoints para Manga

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Convenções de Commit

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Mudanças de formatação
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Mudanças em ferramentas/configurações

## 📄 Licença

Distribuído sob a licença **Apache 2.0**. Consulte o arquivo `LICENSE` para mais detalhes.

---

Feito com ☕ por [Gabriel Finotti](https://github.com/GabrielFinotti). Sugestões e PRs são bem-vindos!
