# Multi-stage build para otimização de tamanho
# Stage 1: Build
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY src/ ./src/

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Instalar dumb-init para melhor handling de sinais
RUN apk add --no-cache dumb-init

# Criar usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar build da aplicação do stage anterior
COPY --from=builder /app/dist ./dist

# Alterar ownership dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta da aplicação
EXPOSE 3333

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3333
ENV TZ=America/Recife
ENV NODE_OPTIONS=--max-old-space-size=1536

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: process.env.PORT || 3333, path: '/api/v3/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
        if (res.statusCode === 200) process.exit(0); \
        else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();" || exit 1

# Iniciar aplicação com dumb-init para melhor handling de sinais
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
