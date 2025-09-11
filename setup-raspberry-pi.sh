#!/bin/bash

# =============================================================================
# Anime List Organizer API - Setup Script para Raspberry Pi (PRODUÇÃO)
# =============================================================================

set -e  # Parar script se algum comando falhar

echo "🍓 Anime List Organizer API - Setup PRODUÇÃO para Raspberry Pi"
echo "=================================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando no Raspberry Pi
if [[ $(uname -m) != "aarch64" && $(uname -m) != "armv7l" ]]; then
    log_warning "Este script foi otimizado para Raspberry Pi, mas pode funcionar em outras arquiteturas."
fi

# Verificar dependências
log_info "Verificando dependências..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker não encontrado. Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    log_success "Docker instalado. REINICIE o terminal/sessão para aplicar as permissões."
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y docker-compose
fi

log_success "Dependências verificadas!"

# Configurar ambiente
log_info "Configurando ambiente para PRODUÇÃO..."

# Criar diretório de dados com permissões corretas
log_info "Criando diretório de persistência de dados..."
mkdir -p data/mongo
sudo chown -R $USER:$USER data/

# Copiar arquivo de ambiente se não existir
if [ ! -f .env ]; then
    log_info "Criando arquivo .env..."
    cp .env.example .env
    log_warning "IMPORTANTE: Configure suas variáveis de ambiente no arquivo .env"
    echo "Especialmente:"
    echo "  - OPENAI_API_KEY"
    echo "  - BASIC_USERNAME"
    echo "  - BASIC_PASSWORD"
else
    log_info "Arquivo .env já existe."
fi

# Configurações específicas para Raspberry Pi
log_info "Aplicando configurações para Raspberry Pi..."

# Verificar se há limitação de memória já configurada
if ! grep -q "NODE_OPTIONS" .env; then
    echo "" >> .env
    echo "# Configurações para Raspberry Pi" >> .env
    echo "NODE_OPTIONS=--max-old-space-size=512" >> .env
    echo "TZ=America/Sao_Paulo" >> .env
    log_success "Configurações de Raspberry Pi adicionadas ao .env"
fi

# Verificar espaço em disco
AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
REQUIRED_SPACE=1048576  # 1GB em KB para produção

if [ $AVAILABLE_SPACE -lt $REQUIRED_SPACE ]; then
    log_warning "Espaço em disco baixo. Recomendado pelo menos 1GB livres."
    log_info "Espaço disponível: $(($AVAILABLE_SPACE / 1024))MB"
fi

# Verificar memória RAM
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
if [ $TOTAL_MEM -lt 512 ]; then
    log_warning "RAM baixa detectada (${TOTAL_MEM}MB). Considere usar swap."
    log_info "Para configurar swap: sudo dphys-swapfile setup && sudo dphys-swapfile swapon"
fi

# Build da imagem Docker
log_info "Construindo imagem Docker..."
docker-compose build

# Iniciar serviços
log_info "Iniciando serviços em produção..."
docker-compose up -d

# Aguardar serviços ficarem prontos
log_info "Aguardando serviços iniciarem..."
sleep 30

# Verificar status dos serviços
log_info "Verificando status dos serviços..."

if docker-compose ps | grep -q "Up"; then
    log_success "Serviços iniciados com sucesso!"
    
    echo ""
    echo "🎉 Setup PRODUÇÃO concluído!"
    echo "=========================="
    echo ""
    echo "Serviços disponíveis:"
    echo "  📱 API: http://localhost:3333/api/v3"
    echo "  🗄️  MongoDB: localhost:27017"
    echo ""
    echo "Comandos úteis:"
    echo "  📋 Ver logs: npm run docker:logs"
    echo "  🔄 Reiniciar: npm run docker:restart"
    echo "  ⏹️  Parar: npm run docker:down"
    echo "  🏥 Health: curl http://localhost:3333/api/v3/health"
    echo ""
    echo "Para desenvolvimento local use: npm run dev"
    
    # Teste básico da API
    sleep 5
    log_info "Testando API..."
    if curl -s http://localhost:3333/api/v3/health > /dev/null; then
        log_success "API respondendo corretamente!"
    else
        log_warning "API pode estar ainda inicializando. Teste novamente em alguns instantes."
    fi
    
else
    log_error "Falha ao iniciar serviços. Verificando logs..."
    docker-compose logs
    echo ""
    echo "Para resolver problemas:"
    echo "  1. Verifique os logs: docker-compose logs"
    echo "  2. Verifique o arquivo .env"
    echo "  3. Verifique se as portas estão livres: netstat -tulpn | grep :3333"
fi

echo ""
log_info "Script de setup finalizado."
