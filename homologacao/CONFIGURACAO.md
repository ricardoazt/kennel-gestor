# Configuração do Ambiente - Kennel Gestor

Este documento explica como configurar o ambiente de desenvolvimento para que funcione corretamente tanto em casa quanto no trabalho.

## Problema Resolvido

Anteriormente, o arquivo `.env` era commitado no Git, causando conflitos quando você alternava entre ambientes (casa ↔ trabalho). Agora, cada ambiente tem sua própria configuração local.

## Configuração Inicial (Primeira Vez)

### 1. Backend

```bash
cd /home/ricardo/dev/antigravity/kennel-gestor/homologacao/backend

# Copiar o template de exemplo
cp .env.example .env

# Editar o .env com suas configurações locais (se necessário)
nano .env
```

**Variáveis importantes no backend:**
- `PORT=3000` - Porta interna do backend (não mudar se usar Docker)
- `ALLOWED_ORIGINS` - Lista de origens permitidas pelo CORS (separadas por vírgula)
- `FRONTEND_URL` - URL do frontend (para referências no backend)

### 2. Frontend

```bash
cd /home/ricardo/dev/antigravity/kennel-gestor/homologacao/frontend

# Copiar o template de exemplo
cp .env.example .env

# Editar o .env com suas configurações locais (se necessário)
nano .env
```

**Variáveis importantes no frontend:**
- `VITE_API_URL` - URL da API backend
  - **Com Docker**: `http://localhost:3001` (porta mapeada do Docker)
  - **Sem Docker**: `http://localhost:3000` (porta direta do backend)

## Diferenças entre Ambientes

### Usando Docker (Padrão)

```env
# frontend/.env
VITE_API_URL=http://localhost:3001
```

O Docker mapeia a porta 3000 do container para 3001 do host (conforme `docker-compose.yml`).

### Sem Docker (Desenvolvimento Local)

```env
# frontend/.env
VITE_API_URL=http://localhost:3000
```

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Rede Local / IP Customizado

Se precisar acessar de outro computador na rede:

```env
# frontend/.env
VITE_API_URL=http://192.168.1.100:3001
```

```env
# backend/.env
ALLOWED_ORIGINS=http://localhost:5173,http://192.168.1.100:5173,http://192.168.1.50:5173
```

## Iniciando a Aplicação

### Com Docker

```bash
cd /home/ricardo/dev/antigravity/kennel-gestor/homologacao
docker-compose up -d
```

Acesse: http://localhost:5173

### Sem Docker

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Alternando entre Casa e Trabalho

**IMPORTANTE**: O arquivo `.env` agora está no `.gitignore` e **não será** commitado.

1. **Em casa**: Configure seu `.env` com as URLs de casa
2. **Commite seu código** (o `.env` não será incluído)
3. **No trabalho**: 
   - Faça `git pull`
   - Se o `.env` não existir, copie do `.env.example`
   - Configure com as URLs do trabalho

Cada ambiente mantém sua própria configuração local!

## Solução de Problemas

### Erro: "Failed to fetch" ou "Network Error"

- Verifique se o `VITE_API_URL` no frontend `.env` está correto
- Verifique se o backend está rodando na porta esperada
- Com Docker: deve ser `http://localhost:3001`
- Sem Docker: deve ser `http://localhost:3000`

### Erro de CORS

- Adicione a origem do seu frontend em `ALLOWED_ORIGINS` no backend `.env`
- Exemplo: `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000`
- Reinicie o backend após alterar

### Erro de MIME type (módulos JavaScript)

- Verifique se o `VITE_API_URL` termina sem barra (`/`)
- Correto: `http://localhost:3001`
- Errado: `http://localhost:3001/`

### Backend não conecta ao banco

- Verifique se o Docker está rodando: `docker ps`
- Verifique os logs: `docker-compose logs backend`
- Verifique a `DATABASE_URL` no backend `.env`

## Verificação Rápida

Após configurar, teste no console do navegador (F12):

```javascript
// Deve mostrar a URL correta da API
console.log(import.meta.env.VITE_API_URL);
```

E verifique que não há erros relacionados a:
- ❌ CORS
- ❌ Failed to fetch
- ❌ MIME type errors
- ❌ localhost:3000 vs localhost:3001
