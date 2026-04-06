# 📦 Redis + Prisma Cache (Manual vs Extension)

Projeto de estudo comparando duas abordagens de cache com Redis em um backend usando:

Node.js + Express
Prisma ORM
PostgreSQL
Redis
🎯 Objetivo

Demonstrar na prática:

- Como implementar cache manual com Redis
- Como usar cache automático com prisma-redis-extension
- Diferenças de controle, complexidade e performance
- Estratégias de invalidação de cache
- Como inspecionar o cache com Redis Insights

# ⚙️ Tecnologias
express
@prisma/client
redis (manual)
ioredis (extension)
prisma-redis-extension
Docker (Redis server)
PostgreSQL

🚀 Setup
1. Subir Redis com Docker
docker run --name redis-cache -p 6379:6379 -d redis
2. Instalar dependências
- Manual: npm install redis
- Middleware: npm install prisma-redis-extension ioredis
3. Rodar os servidores

# Manual:

npm run dev: manual
porta 3001

# Middleware:

npm run dev: middleware
porta 3002

# ⚖️ Diferenças principais
- Aspecto	Manual	Extension
- Controle	Total	Limitado
- Complexidade	Alta	Baixa
- Código	Verboso	Limpo
- Cache por rota	Sim	Não (por model/query)
- Invalidação	Manual	Automática
- Debug	Manual	Hooks (onHit, onMiss)
- Flexibilidade	Máxima	Média

# 📊 Vantagens reais
Manual: maior controle (ex: cache por rota, headers, params), customização total de key, ideal para lógica específica (ex: multi-tenant, filtros complexos)
Extension: zero boilerplate, fácil de escalar, padronização automática, menos chance de erro humano, integração direta com Prisma

# 🔍 Como testar na prática (diferença real)
1. Teste de tempo (ms)

Use:

Postman
Insomnia
ou curl

Primeira requisição:

~100ms+ (banco)

Segunda:

~1-5ms (cache)
2. Log no console

Manual:

CACHE MISS
CACHE HIT

Extension:

🟢 CACHE HIT
🔴 CACHE MISS
3. Redis Insights

Use o Redis Insight

Você consegue ver:
- keys sendo criadas (products:all)
- TTL diminuindo
- dados armazenados
- invalidação acontecendo

# 🧪 Cenários que você deve testar
- GET repetido (ver cache funcionando)
- POST criando item (ver invalidação)
- PUT atualizando (ver invalidação)
- TTL expirando (ver novo MISS)

# 🧩 Quando usar cada abordagem
Use manual se:
- precisa controlar cache por endpoint
- lógica depende de headers/query params
- precisa de estratégia customizada
Use extension se:
- quer rapidez de implementação
- usa Prisma intensivamente
- quer padronização
- time não quer lidar com cache manual

# ⚠️ Limitações do middleware

O extension não cobre: queries customizadas complexas, cache baseado em headers (ex: auth, locale), lógica fora do Prisma, queryRaw

🛠️ O que fazer nesses casos?
usar  manual quando necessário

📚 Documentação
Redis
Prisma
prisma-redis-extension
