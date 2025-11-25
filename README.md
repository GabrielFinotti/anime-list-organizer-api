
# Desenvolvimento com Docker (hot reload)

Este projeto inclui um `docker-compose.dev.yml` para rodar a API em modo de desenvolvimento com hot reload (usando `tsx watch`) e um serviço do MongoDB.

Arquivos adicionados:

- `Dockerfile.dev` — Dockerfile otimizado para desenvolvimento (instala dependências com `npm ci` e expõe a porta 3000).
- `docker-compose.dev.yml` — Orquestra os serviços `api` e `mongo`.
- `.dockerignore` — Arquivos ignorados pela build.

Como usar:

1. Confirme que você tem Docker e Docker Compose instalados.
2. Crie/atualize seu `.env` local (opcional). O `docker-compose` já configura `MONGO_URI` e `MONGO_NAME` internamente.
3. Inicie os serviços com:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Ou via npm script:

```bash
npm run dev:docker
```

Após iniciado, a API será exposta na porta `3000`. O MongoDB não será exposto para o host — ele ficará acessível internamente pela rede do Docker Compose via `mongo:27017`.

Observações:

- O hot reload funciona via `tsx watch` (já configurado no script `dev`). Certifique-se de não ter `node_modules` locais em conflito ao usar volumes.
  
Atenção:

- Agora o MongoDB está configurado como "interno" no `docker-compose.dev.yml`: não haverá mapeamento de porta para o host. Para acessar o banco diretamente a partir do host (para depuração), use `docker compose exec mongo mongosh` ou exponha temporariamente a porta se necessário.

Nota sobre variáveis de ambiente:

- `MONGO_URI` agora deve conter apenas protocolo + host + porta (ex.: `mongodb://mongo:27017`) e `MONGO_NAME` deve ter o nome da base de dados (ex.: `anime_list`) — isto mantém compatibilidade com a configuração do projeto, que combina `MONGO_URI` + `MONGO_NAME` no `MongoConfig.newConnection`.
- Se preferir rodar com `docker compose` sem montar volumes, remova `volumes` do serviço `api` no `docker-compose.dev.yml`.

Parando os serviços:

```bash
docker compose -f docker-compose.dev.yml down
```

Se quiser forçar a reconstrução:

```bash
docker compose -f docker-compose.dev.yml up --build --force-recreate
```
