# Anime Timeline API

<div align="center">

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E=18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-GPL--3.0-orange)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Tests](https://img.shields.io/badge/tests-97%20passed-brightgreen)
[![Validate PR](https://github.com/GabrielFinotti/anime-list-organizer-api/actions/workflows/validate.yml/badge.svg)](https://github.com/GabrielFinotti/anime-list-organizer-api/actions/workflows/validate.yml)
[![codecov](https://codecov.io/gh/GabrielFinotti/anime-timeline-api/branch/main/graph/badge.svg)](https://codecov.io/gh/GabrielFinotti/anime-timeline-api)
[![Docker Image](https://img.shields.io/docker/pulls/gabrielfinotti/anime-list-organizer-api?logo=docker&label=docker%20pulls)](https://hub.docker.com/r/gabrielfinotti/anime-list-organizer-api)

**API RESTful para gerenciamento de animes com arquitetura DDD, autenticação JWT e lookup inteligente via OpenAI.**

[🚀 Quick Start](#-quick-start) •
[📖 Documentação](#-documentação-da-api) •
[🐳 Docker](#-docker) •
[🧪 Testes](#-testes) •
[🤝 Contribuição](#-contribuição)

</div>
---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitetura](#-arquitetura)
- [Quick Start](#-quick-start)
- [Configuração](#%EF%B8%8F-configuração)
- [Docker](#-docker)
- [Documentação da API](#-documentação-da-api)
- [Testes](#-testes)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## ✨ Visão Geral

O **Anime Timeline API** é uma API REST completa para gerenciamento e organização de animes, desenvolvida com **Domain-Driven Design (DDD)** e **Clean Architecture**. A aplicação permite:

- 📺 **Catálogo de Animes**: CRUD completo com suporte a filmes, temporadas e gêneros
- 👤 **Gerenciamento de Usuários**: Sistema completo de perfil e lista personalizada de animes
- 🔐 **Autenticação JWT**: Login seguro com token blacklist via Redis
- 🤖 **Lookup Inteligente**: Busca automática de metadados via GPT-5 com web search
- 🖼️ **Upload de Imagens**: Integração com Cloudflare R2 para armazenamento
- 📊 **Tracking de Progresso**: Acompanhamento de episódios, temporadas e status

---

## 🧱 Stack Tecnológico

### Core

| Tecnologia                                                                                        | Versão  | Descrição                  |
| ------------------------------------------------------------------------------------------------- | ------- | -------------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)          | >= 18.x | Runtime JavaScript         |
| ![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)          | 5.1.0   | Framework web              |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) | 5.9.3   | Superset JavaScript tipado |

### Database & Cache

| Tecnologia                                                                                   | Descrição               |
| -------------------------------------------------------------------------------------------- | ----------------------- |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)     | Banco de dados NoSQL    |
| ![Mongoose](https://img.shields.io/badge/Mongoose-8.19-880000?logo=mongoose&logoColor=white) | ODM para MongoDB        |
| ![Redis](https://img.shields.io/badge/Redis-Latest-DC382D?logo=redis&logoColor=white)        | Cache e token blacklist |

### Serviços Externos

| Tecnologia                                                                                       | Descrição                    |
| ------------------------------------------------------------------------------------------------ | ---------------------------- |
| ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?logo=openai&logoColor=white)         | Lookup inteligente de animes |
| ![Cloudflare](https://img.shields.io/badge/Cloudflare-R2-F38020?logo=cloudflare&logoColor=white) | Storage de imagens           |

### DevOps & Testing

| Tecnologia                                                                                | Descrição           |
| ----------------------------------------------------------------------------------------- | ------------------- |
| ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white) | Containerização     |
| ![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)            | Framework de testes |

---

## 🗂 Arquitetura

O projeto segue os princípios de **Domain-Driven Design (DDD)** com **Clean Architecture**, organizando o código em camadas bem definidas:

```
src/
├── domain/                    # 🎯 Camada de Domínio (Core)
│   ├── entities/              # Entidades de negócio
│   │   ├── Anime.entity.ts
│   │   ├── Category.entity.ts
│   │   ├── Genre.entity.ts
│   │   └── User.entity.ts
│   ├── value-objects/         # Objetos de valor imutáveis
│   │   ├── id.value-object.ts
│   │   ├── name.value-object.ts
│   │   ├── email.value-object.ts
│   │   ├── password.value-object.ts
│   │   ├── description.value-object.ts
│   │   ├── url.value-object.ts
│   │   ├── movie.value-object.ts
│   │   ├── season.value-object.ts
│   │   └── *status.value-object.ts
│   ├── errors/                # Erros de domínio
│   └── repositories/          # Interfaces de repositório
│
├── application/               # 📦 Camada de Aplicação
│   ├── use-cases/             # Casos de uso
│   │   ├── anime/             # Use cases de anime
│   │   ├── auth/              # Use cases de autenticação
│   │   ├── category/          # Use cases de categoria
│   │   ├── genre/             # Use cases de gênero
│   │   └── user/              # Use cases de usuário
│   ├── dtos/                  # Data Transfer Objects
│   ├── mappers/               # Mappers de aplicação
│   ├── services/              # Interfaces de serviços
│   └── errors/                # Erros de aplicação
│
├── infrastructure/            # 🔧 Camada de Infraestrutura
│   ├── database/              # Configuração MongoDB
│   │   ├── config/
│   │   └── models/
│   ├── repositories/          # Implementações de repositório
│   ├── mappers/               # Mappers de persistência
│   ├── cache/                 # Cliente Redis
│   ├── api/                   # Integrações externas
│   │   └── gpt/               # OpenAI Lookup Service
│   ├── cloudflare/            # Cloudflare R2
│   ├── services/              # Implementações de serviços
│   ├── factories/             # Factories para DI
│   └── env/                   # Configuração de ambiente
│
├── presentation/              # 🌐 Camada de Apresentação
│   └── http/
│       ├── controllers/       # Controllers HTTP
│       ├── middlewares/       # Middlewares Express
│       └── routes/            # Definição de rotas
│
├── app.ts                     # Configuração do Express
└── server.ts                  # Entry point
```

### Fluxo de Dados

```
Request → Route → Middleware → Controller → Use Case → Repository → Database
                                    ↓
                              Domain Entity
                                    ↓
Response ← Controller ← Mapper ← Use Case
```

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** >= 18.x
- **Docker** e **Docker Compose** (recomendado)
- **MongoDB** (se não usar Docker)
- **Redis** (se não usar Docker)
- Conta **OpenAI** com API Key
- Conta **Cloudflare** com R2 configurado

### Instalação Rápida com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/GabrielFinotti/anime-list-organizer-api.git
cd anime-list-organizer-api

# 2. Configure as variáveis de ambiente
cp .env.example .env.development
# Edite .env.development com suas configurações

# 3. Inicie o ambiente de desenvolvimento
npm run dev:docker
```

A API estará disponível em `http://localhost:3000/api`

### Instalação Manual

```bash
# 1. Clone o repositório
git clone https://github.com/GabrielFinotti/anime-list-organizer-api.git
cd anime-list-organizer-api

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite .env com suas configurações (MongoDB e Redis devem estar rodando)

# 4. Inicie em modo desenvolvimento
npm run dev
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
VERSION=4.0.0
CORS_ORIGINS=*

# Database Configuration
MONGO_URI=mongodb://localhost:27017
MONGO_NAME=anime_timeline_db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-super-secret-jwt-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_DOMAIN=your-public-domain.r2.dev

# JWT Configuration
TOKEN_EXPIRATION=24h
```

### Tabela de Variáveis

| Variável           | Obrigatória | Descrição            | Exemplo                      |
| ------------------ | :---------: | -------------------- | ---------------------------- |
| `NODE_ENV`         |     ✅      | Ambiente de execução | `development` / `production` |
| `PORT`             |     ✅      | Porta do servidor    | `3000`                       |
| `VERSION`          |     ✅      | Versão da API        | `4.0.0`                      |
| `CORS_ORIGINS`     |     ✅      | Origins permitidas   | `*` ou `https://meusite.com` |
| `MONGO_URI`        |     ✅      | URI do MongoDB       | `mongodb://localhost:27017`  |
| `MONGO_NAME`       |     ✅      | Nome do banco        | `anime_timeline_db`          |
| `REDIS_URL`        |     ✅      | URL do Redis         | `redis://localhost:6379`     |
| `SECRET_KEY`       |     ✅      | Chave para JWT       | String segura                |
| `OPENAI_API_KEY`   |     ✅      | API Key OpenAI       | `sk-xxxxx`                   |
| `CLOUDFLARE_*`     |     ✅      | Configurações R2     | Ver acima                    |
| `TOKEN_EXPIRATION` |     ✅      | Expiração do token   | `24h`, `7d`                  |

---

## 🐳 Docker

### Desenvolvimento

```bash
# Inicia todos os serviços (API + MongoDB + Redis)
npm run dev:docker

# Visualizar logs
docker logs -f api-dev
```

### Produção

```bash
# Build da imagem
npm run build:docker

# Inicia os serviços
npm run docker:up

# Para os serviços
npm run docker:down

# Rebuild completo
npm run docker:rebuild

# Visualizar logs
npm run docker:logs
```

### Arquitetura Docker

```
┌─────────────────────────────────────────┐
│           Docker Network                │
├─────────────┬─────────────┬─────────────┤
│   api-*     │  mongo-*    │  redis-*    │
│   :3000     │  :27017     │  :6379      │
│             │             │             │
│  Node.js    │  MongoDB    │   Redis     │
│  Express    │             │             │
└─────────────┴─────────────┴─────────────┘
```

---

## 📖 Documentação da API

### Base URL

```
http://localhost:3000/api
```

### Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Inclua o token no header:

```http
Authorization: Bearer <seu-token-jwt>
```

### Formato de Resposta

Todas as respostas seguem o padrão:

**Sucesso:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operação realizada com sucesso",
  "data": {}
}
```

**Erro:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descrição do erro",
  "data": null
}
```

### Endpoints

#### 🏥 Health Check

| Método | Endpoint  | Descrição              | Auth |
| ------ | --------- | ---------------------- | :--: |
| `GET`  | `/health` | Verifica status da API |  ❌  |

---

#### 🔐 Autenticação

| Método | Endpoint       | Descrição      | Auth |
| ------ | -------------- | -------------- | :--: |
| `POST` | `/auth/login`  | Realiza login  |  ❌  |
| `POST` | `/auth/logout` | Realiza logout |  ✅  |

<details>
<summary><b>POST /auth/login</b></summary>

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "minhasenha123"
}
```

**Response 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "01HXYZ...",
      "username": "usuario",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

</details>

---

#### 👤 Usuários

| Método   | Endpoint                                       | Descrição                  | Auth | Role  |
| -------- | ---------------------------------------------- | -------------------------- | :--: | :---: |
| `POST`   | `/users`                                       | Criar usuário              |  ❌  |   -   |
| `GET`    | `/users`                                       | Listar usuários            |  ✅  | admin |
| `GET`    | `/users/:id`                                   | Buscar por ID              |  ✅  |  any  |
| `PUT`    | `/users/:id`                                   | Atualizar usuário          |  ✅  |  any  |
| `DELETE` | `/users/:id`                                   | Remover usuário            |  ✅  | admin |
| `POST`   | `/users/:id/anime-list`                        | Adicionar anime à lista    |  ✅  |  any  |
| `DELETE` | `/users/:id/anime-list/:animeId`               | Remover anime da lista     |  ✅  |  any  |
| `PATCH`  | `/users/:id/anime-list/:animeId/like`          | Toggle like anime          |  ✅  |  any  |
| `PATCH`  | `/users/:id/anime-list/:animeId/status`        | Atualizar status anime     |  ✅  |  any  |
| `PATCH`  | `/users/:id/anime-list/:animeId/movie-status`  | Atualizar status filme     |  ✅  |  any  |
| `PATCH`  | `/users/:id/anime-list/:animeId/season-status` | Atualizar status temporada |  ✅  |  any  |

<details>
<summary><b>POST /users - Criar Usuário</b></summary>

**Request Body:**

```json
{
  "imageUrl": "https://example.com/avatar.jpg",
  "username": "novousuario",
  "email": "user@example.com",
  "password": "MinhaSenh@123",
  "biography": "Fã de animes desde 2010"
}
```

**Response 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "01HXYZ...",
    "imageUrl": "https://example.com/avatar.jpg",
    "username": "novousuario",
    "email": "user@example.com",
    "biography": "Fã de animes desde 2010",
    "animeList": { "list": [], "updatedAt": "2024-12-09T..." },
    "favoriteAnimes": [],
    "role": "user",
    "createdAt": "2024-12-09T...",
    "updatedAt": "2024-12-09T..."
  }
}
```

</details>

---

#### 📺 Animes

| Método   | Endpoint                      | Descrição           | Auth | Role  |
| -------- | ----------------------------- | ------------------- | :--: | :---: |
| `GET`    | `/animes`                     | Listar animes       |  ✅  |  any  |
| `GET`    | `/animes/:id`                 | Buscar por ID       |  ✅  |  any  |
| `GET`    | `/animes/lookup?title=`       | Lookup via IA       |  ✅  | admin |
| `POST`   | `/animes`                     | Criar anime         |  ✅  | admin |
| `PUT`    | `/animes/:id`                 | Atualizar anime     |  ✅  | admin |
| `DELETE` | `/animes/:id`                 | Remover anime       |  ✅  | admin |
| `POST`   | `/animes/:id/movies`          | Adicionar filme     |  ✅  | admin |
| `DELETE` | `/animes/:id/movies`          | Remover filme       |  ✅  | admin |
| `POST`   | `/animes/:id/seasons`         | Adicionar temporada |  ✅  | admin |
| `DELETE` | `/animes/:id/seasons`         | Remover temporada   |  ✅  | admin |
| `POST`   | `/animes/:id/genres`          | Adicionar gêneros   |  ✅  | admin |
| `DELETE` | `/animes/:id/genres/:genreId` | Remover gênero      |  ✅  | admin |

<details>
<summary><b>POST /animes - Criar Anime</b></summary>

**Request Body:**

```json
{
  "imageUrl": "https://example.com/anime-cover.jpg",
  "name": "Shingeki no Kyojin",
  "synopsis": "Em um mundo onde a humanidade vive dentro de cidades cercadas...",
  "categoryId": "01HXYZ...",
  "genreIds": ["01HXYZ...", "01HXYZ..."],
  "animeType": "serie",
  "productionType": "adaptation",
  "typeOfMaterialOrigin": "manga",
  "movies": [{ "name": "Attack on Titan: Chronicle", "releaseDate": "2020-07-17" }],
  "seasons": [{ "seasonNumber": 1, "releaseDate": "2013-04-07", "totalEpisodes": 25 }],
  "isAdultContent": false
}
```

**Tipos válidos:**

- `animeType`: `serie`, `movie`, `mixed`
- `productionType`: `original`, `adaptation`
- `typeOfMaterialOrigin`: `manga`, `light_novel`, `visual_novel`, `game`, `other`, `none`

</details>

<details>
<summary><b>GET /animes/lookup - Lookup via IA</b></summary>

**Query Parameters:**

- `title` (obrigatório): Nome do anime para buscar

**Request:**

```http
GET /animes/lookup?title=Demon%20Slayer
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Anime lookup successful",
  "data": {
    "name": "Kimetsu no Yaiba",
    "synopsis": "A história segue Tanjiro Kamado, um jovem vendedor de carvão...",
    "category": "Shounen",
    "genres": ["Ação", "Fantasia", "Sobrenatural"],
    "animeType": "serie",
    "productionType": "adaptation",
    "typeOfMaterialOrigin": "manga",
    "isAdultContent": false
  }
}
```

</details>

---

#### 📁 Categorias

| Método   | Endpoint          | Descrição         | Auth | Role  |
| -------- | ----------------- | ----------------- | :--: | :---: |
| `GET`    | `/categories`     | Listar categorias |  ✅  |  any  |
| `GET`    | `/categories/:id` | Buscar por ID     |  ✅  |  any  |
| `POST`   | `/categories`     | Criar categoria   |  ✅  | admin |
| `DELETE` | `/categories/:id` | Remover categoria |  ✅  | admin |

---

#### 🏷️ Gêneros

| Método   | Endpoint      | Descrição      | Auth | Role  |
| -------- | ------------- | -------------- | :--: | :---: |
| `GET`    | `/genres`     | Listar gêneros |  ✅  |  any  |
| `GET`    | `/genres/:id` | Buscar por ID  |  ✅  |  any  |
| `POST`   | `/genres`     | Criar gênero   |  ✅  | admin |
| `DELETE` | `/genres/:id` | Remover gênero |  ✅  | admin |

---

### Códigos de Status

| Código | Descrição                            |
| ------ | ------------------------------------ |
| `200`  | OK - Operação bem-sucedida           |
| `201`  | Created - Recurso criado             |
| `400`  | Bad Request - Dados inválidos        |
| `401`  | Unauthorized - Não autenticado       |
| `403`  | Forbidden - Sem permissão            |
| `404`  | Not Found - Recurso não encontrado   |
| `409`  | Conflict - Conflito (ex: duplicado)  |
| `500`  | Internal Server Error - Erro interno |

---

## 🧪 Testes

O projeto possui **97 testes** divididos em unitários e integração:

```bash
# Executar todos os testes
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Com watch mode
npm run test:watch

# Com cobertura
npm run test:coverage
npm run test:unit:coverage
npm run test:integration:coverage
```

### Estrutura de Testes

```
tests/
├── unit/                      # 86 testes unitários
│   ├── application/
│   │   ├── mappers/
│   │   └── use-cases/
│   ├── domain/
│   │   ├── entities/
│   │   └── value-objects/
│   ├── infrastructure/
│   │   ├── api/
│   │   ├── cache/
│   │   ├── cloudflare/
│   │   ├── database/
│   │   ├── mappers/
│   │   ├── repositories/
│   │   └── services/
│   └── presentation/
│       └── http/
│           ├── controllers/
│           └── middlewares/
│
└── integration/               # 11 testes de integração
    ├── setup/
    ├── anime/
    ├── auth/
    ├── category/
    ├── genre/
    └── user/
```

---

## 📜 Scripts Disponíveis

| Comando                    | Descrição                                   |
| -------------------------- | ------------------------------------------- |
| `npm run dev`              | Inicia em modo desenvolvimento (hot-reload) |
| `npm run build`            | Gera build otimizado via tsup               |
| `npm start`                | Executa build de produção                   |
| `npm run dev:docker`       | Inicia ambiente Docker de desenvolvimento   |
| `npm run docker:up`        | Inicia containers de produção               |
| `npm run docker:down`      | Para containers de produção                 |
| `npm run docker:rebuild`   | Rebuild completo de produção                |
| `npm run docker:logs`      | Visualiza logs do container                 |
| `npm test`                 | Executa todos os testes                     |
| `npm run test:unit`        | Executa testes unitários                    |
| `npm run test:integration` | Executa testes de integração                |
| `npm run test:coverage`    | Gera relatório de cobertura                 |
| `npm run lint:format`      | Formata código com Prettier                 |
| `npm run lint:check`       | Verifica formatação                         |
| `npm run type-check`       | Verifica tipos TypeScript                   |

---

## 🛡 Roadmap

### Implementado ✅

- [x] Arquitetura DDD com Clean Architecture
- [x] CRUD completo de Animes, Categorias e Gêneros
- [x] Sistema de usuários com lista personalizada
- [x] Autenticação JWT com Redis
- [x] Lookup inteligente via OpenAI GPT-5
- [x] Upload de imagens via Cloudflare R2
- [x] Docker para desenvolvimento e produção
- [x] Suite de testes (unitários e integração)
- [x] CORS configurável
- [x] Health check endpoint

### Em Progresso 🔄

- [ ] Swagger/OpenAPI documentação interativa
- [ ] Rate limiting
- [ ] Cache de resultados de lookup
- [ ] Paginação e filtros avançados
- [ ] WebSocket para atualizações em tempo real

### Planejado 📋

- [ ] Endpoints para Manga
- [ ] Sistema de notificações
- [ ] Recomendações baseadas em histórico
- [ ] Integração com APIs externas (MyAnimeList, AniList)
- [ ] Métricas e observabilidade (Prometheus/Grafana)
- [ ] CI/CD pipeline
- [ ] Deploy automatizado

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:

   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

3. Faça **commit** das mudanças:

   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```

4. **Push** para a branch:

   ```bash
   git push origin feature/nova-funcionalidade
   ```

5. Abra um **Pull Request**

### Convenções de Commit

Este projeto utiliza [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo     | Descrição           |
| ----------- | ------------------- |
| `feat:`     | Nova funcionalidade |
| `fix:`      | Correção de bug     |
| `docs:`     | Documentação        |
| `style:`    | Formatação          |
| `refactor:` | Refatoração         |
| `test:`     | Testes              |
| `chore:`    | Manutenção          |

---

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

Feito com ☕ por [Gabriel Finotti](https://github.com/GabrielFinotti)

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
