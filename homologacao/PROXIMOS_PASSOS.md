# Próximos Passos - Kennel Gestor

Este documento contém sugestões de melhorias e funcionalidades futuras para o sistema Kennel Gestor.

## 📋 Cadastro de Prestadores de Serviços

### Objetivo
Criar um módulo completo para gerenciar veterinários, clínicas e outros prestadores de serviços que atendem o canil.

### Funcionalidades Sugeridas

#### 1. Tela de Listagem de Prestadores
- Tabela com todos os prestadores cadastrados
- Filtros por tipo (Veterinário, Clínica, Laboratório, etc.)
- Busca por nome
- Indicador de prestadores ativos/inativos
- Botão para adicionar novo prestador

#### 2. Formulário de Cadastro/Edição
**Informações Básicas:**
- Nome completo / Razão social
- Tipo de prestador (Veterinário, Clínica, Laboratório, Pet Shop, etc.)
- CPF/CNPJ
- CRMV (para veterinários)
- Especialidades (ex: Ortopedia, Cardiologia, Dermatologia)

**Contato:**
- Telefone principal
- Telefone secundário
- E-mail
- WhatsApp

**Endereço:**
- CEP
- Rua
- Número
- Complemento
- Bairro
- Cidade
- Estado

**Informações Adicionais:**
- Horário de atendimento
- Observações
- Status (Ativo/Inativo)

#### 3. Integração com Eventos de Saúde
- Carregar prestadores dinamicamente no dropdown do formulário de eventos
- Filtrar por tipo relevante (ex: apenas veterinários para consultas)
- Opção "Adicionar novo prestador" direto do formulário
- Manter opção "Interno/Canil" sempre disponível

#### 4. Backend - API Endpoints

```javascript
// Listar todos os prestadores
GET /api/prestadores
Query params: ?tipo=veterinario&ativo=true

// Buscar prestador por ID
GET /api/prestadores/:id

// Criar novo prestador
POST /api/prestadores
Body: { nome, tipo, cpf_cnpj, crmv, telefone, email, ... }

// Atualizar prestador
PUT /api/prestadores/:id

// Desativar prestador (soft delete)
DELETE /api/prestadores/:id
```

#### 5. Modelo de Banco de Dados

```sql
CREATE TABLE prestadores_servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'veterinario', 'clinica', 'laboratorio', etc.
    cpf_cnpj VARCHAR(18),
    crmv VARCHAR(20),
    especialidades TEXT[], -- Array de especialidades
    telefone_principal VARCHAR(20),
    telefone_secundario VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    horario_atendimento TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Relatórios e Estatísticas
- Prestadores mais utilizados
- Histórico de serviços por prestador
- Custos por prestador (se integrado com financeiro)
- Avaliação de prestadores (opcional)

## 🔄 Outras Melhorias Sugeridas

### Eventos de Saúde
- [ ] Adicionar campo de custo/valor do procedimento
- [ ] Upload de documentos/laudos relacionados ao evento
- [ ] Lembretes automáticos para vacinas e vermífugos
- [ ] Histórico de peso do animal em gráfico
- [ ] Exportar histórico de saúde em PDF

### Gestão do Plantel
- [ ] Filtros avançados na listagem
- [ ] Exportação de dados para Excel/CSV
- [ ] Impressão de fichas individuais
- [ ] QR Code para acesso rápido ao perfil
- [ ] Galeria de fotos do animal

### Sistema Geral
- [ ] Notificações push para eventos importantes
- [ ] Dashboard com indicadores-chave
- [ ] Backup automático de dados
- [ ] Logs de auditoria (quem fez o quê e quando)
- [ ] Permissões de usuário (admin, veterinário, funcionário)

### Integrações Futuras
- [ ] WhatsApp Business API para notificações
- [ ] Integração com Google Calendar para agendamentos
- [ ] Sistema de pagamentos online
- [ ] App mobile (React Native)

## 📝 Notas de Implementação

### Prioridade Alta
1. Cadastro de Prestadores de Serviços
2. Integração com formulário de eventos de saúde
3. Lembretes automáticos de vacinas

### Prioridade Média
1. Upload de documentos em eventos
2. Relatórios de prestadores
3. Exportação de dados

### Prioridade Baixa
1. App mobile
2. Integrações externas
3. Sistema de avaliações

---

**Última atualização:** 22/12/2025
**Versão do documento:** 1.0
