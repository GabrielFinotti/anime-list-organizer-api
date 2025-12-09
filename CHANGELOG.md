# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

## [4.0.0] - 2025-12-09

### ⚠️ BREAKING CHANGES

- Arquitetura completamente reestruturada para Domain-Driven Design (DDD)
- Mudança de autenticação Basic Auth para JWT com suporte a refresh tokens
- Nova estrutura de endpoints REST com prefixo `/api/vX`
- Modelo de dados reformulado com Value Objects e entidades de domínio
- Licença alterada de Apache 2.0 para GPL-3.0-or-later
- Migração de CommonJS para ESM (ECMAScript Modules)
- Remoção do sistema de Adult Genres (gêneros adultos separados) - agora tratado via flag `isAdultContent`

### Added

#### Arquitetura & Estrutura

- **Domain-Driven Design (DDD)**: Nova arquitetura em camadas com separação clara de responsabilidades
  - `domain/`: Entidades, Value Objects, erros de domínio e interfaces de repositório
  - `application/`: DTOs, Use Cases, serviços de aplicação e mappers
  - `infrastructure/`: Implementações de repositório, cache, banco de dados e serviços externos
  - `presentation/`: Controllers HTTP, middlewares e rotas
- **Value Objects**: Implementação de objetos de valor imutáveis para validação de domínio
  - `Id` (baseado em ULID), `Name`, `Email`, `Password`, `Description`, `Url`
  - `Movie`, `Season`, `AnimeStatus`, `MovieStatus`, `SeasonStatus`
- **Use Cases**: Padrão de casos de uso para orquestração de lógica de negócio
- **Factory Pattern**: Factories para injeção de dependências em controllers, repositories, services e use cases

#### Autenticação & Segurança

- **Sistema de Autenticação JWT**: Login/logout com tokens JWT
- **Token Blacklist**: Invalidação de tokens via Redis para logout seguro
- **Role-Based Access Control (RBAC)**: Middleware de controle de acesso por roles (`user`, `admin`)
- **Password Hashing**: Hash seguro de senhas com bcrypt

#### Usuários

- **Entidade User**: Nova entidade completa de usuário com:
  - Perfil (imageUrl, username, email, biography)
  - Lista de animes personalizada com status de acompanhamento
  - Sistema de favoritos derivado de `isLiked`
  - Controle de roles (user/admin)
- **Gerenciamento de Lista de Animes**:
  - Adicionar/remover animes da lista pessoal
  - Toggle de like/favorito em animes
  - Atualização de status de anime (watching, finished, dropped, in_list)
  - Atualização de status de temporadas (com episódio atual)
  - Atualização de status de filmes

#### Animes

- **Modelo de Anime Reformulado**:
  - Campo `imageUrl` para imagem de capa
  - Campo `animeType`: série, filme ou misto
  - Campo `productionType`: original ou adaptação
  - Campo `typeOfMaterialOrigin`: manga, light novel, visual novel, game, other, none
  - Suporte a múltiplos filmes e temporadas com datas de lançamento
  - Flag `isAdultContent` para conteúdo adulto
- **Gerenciamento de Conteúdo**:
  - Adição/remoção de filmes
  - Adição/remoção de temporadas
  - Adição/remoção de gêneros (suporte a múltiplos gêneros de uma vez)

#### Categorias & Gêneros

- **Category**: Adicionado campo `translatedName` e `targetAudience`
- **Genre**: Estrutura simplificada com nome e descrição

#### Infraestrutura

- **Docker**: Configuração completa com Docker Compose para desenvolvimento e produção
  - `docker-compose.dev.yml`: Ambiente de desenvolvimento com hot-reload
  - `docker-compose.prod.yml`: Ambiente de produção com healthchecks
  - Dockerfiles otimizados para dev e prod
- **Redis**: Cache e armazenamento de token blacklist
- **Cloudflare R2**: Integração para armazenamento de imagens
  - `R2Service`: Upload e gestão de imagens
  - `ImagesService`: Processamento de imagens com Sharp
- **MongoDB**: Modelos Mongoose reformulados com schemas tipados

#### Serviços Externos

- **GPT Lookup Service**: Serviço de busca inteligente de metadados de anime via OpenAI
  - Configuração de agente GPT personalizado
  - Build de prompts otimizados
  - Parser de resposta estruturada

#### Testes

- **Jest**: Framework de testes configurado com ESM
- **86 testes unitários** cobrindo:
  - Entidades de domínio (Anime, Category, Genre, User)
  - Value Objects (todos os VOs implementados)
  - Use Cases (todos os casos de uso)
  - Mappers (application e persistence)
  - Repositories (implementações)
  - Services (JWT, TokenBlacklist, Images, R2, GPT Lookup)
  - Middlewares (auth, error handler, role)
  - Controllers (todos os controllers)
- **11 testes de integração** cobrindo:
  - Fluxos de autenticação
  - CRUD de animes, categorias, gêneros e usuários
  - Gerenciamento de lista de animes do usuário

#### Developer Experience

- **Prettier**: Configuração de formatação de código
- **tsup**: Build otimizado para produção
- **ESM**: Migração completa para ECMAScript Modules
- **Variáveis de Ambiente**: Classe `StartEnv` com validação e tipagem
- **Arquivo `.env.example`**: Template de variáveis de ambiente

### Changed

- **Versão**: Bump de 3.1.0 para 4.0.0
- **Nome do Projeto**: "anime-timeline-api" → "anime-timeline-api"
- **Licença**: Apache 2.0 → GPL-3.0-or-later
- **Autenticação**: Basic Auth → JWT com Redis
- **Arquitetura**: MVC simples → DDD com Clean Architecture
- **Módulos**: CommonJS → ESM
- **Express**: Atualizado para v5.1.0
- **OpenAI SDK**: Atualizado de v5.15.0 para v6.9.1
- **Mongoose**: Atualizado de v8.17.2 para v8.19.3

### Removed

- **Adult Genres**: Sistema separado de gêneros adultos removido
  - Substituído por flag `isAdultContent` na entidade Anime
- **Basic Auth**: Middleware de autenticação básica removido
- **Manga Model**: Modelo de manga removido temporariamente
- **Zod**: Removido como dependência (validação agora no domínio via Value Objects)
- **Estrutura MVC antiga**: Controllers, services e repositories da versão anterior

### Fixed

- Validação de entrada agora acontece na camada de domínio
- Normalização consistente de dados (e-mails em lowercase, nomes trimados)
- Tratamento de erros estruturado com tipos específicos de erro de domínio

### Security

- Senhas armazenadas com hash bcrypt
- Tokens JWT com expiração configurável
- Blacklist de tokens para invalidação em logout
- Variáveis de ambiente validadas na inicialização
- Separação de roles com middleware dedicado

---

## [3.1.0] - Versão Anterior (main)

### Features

- CRUD completo para animes
- Lookup via OpenAI para metadados
- Suporte a categorias, gêneros e gêneros adultos
- Autenticação Basic Auth
- Arquitetura MVC

### Stack

- Node.js >= 18.x
- Express.js
- TypeScript
- MongoDB com Mongoose
- OpenAI SDK v5.x
- Zod para validação

---

## Comparativo de Versões

| Aspecto      | v3.1.0 (main) | v4.0.0 (atual)                 |
| ------------ | ------------- | ------------------------------ |
| Arquitetura  | MVC           | DDD + Clean Architecture       |
| Autenticação | Basic Auth    | JWT + Redis                    |
| Usuários     | Não suportado | Completo com perfil e lista    |
| Testes       | Não           | 97 testes (unit + integration) |
| Docker       | Não           | Sim (dev + prod)               |
| Cache        | Não           | Redis                          |
| Storage      | Não           | Cloudflare R2                  |
| Módulos      | CommonJS      | ESM                            |
| Licença      | Apache 2.0    | GPL-3.0-or-later               |
