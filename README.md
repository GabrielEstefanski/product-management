# 🛍️ Product Management System

Sistema completo de gerenciamento de produtos com arquitetura moderna, desenvolvido com **Next.js 15** (frontend) e **.NET 8** (backend), seguindo princípios de Clean Architecture e Domain-Driven Design.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Melhorias Futuras](#-melhorias-futuras)

## 🎯 Visão Geral

O **Product Management System** é uma aplicação full-stack que permite o gerenciamento completo de produtos, incluindo:

- ✅ **CRUD completo** de produtos
- 🔍 **Busca e filtros** avançados (nome, categoria, preço, disponibilidade)
- 📊 **Paginação** e ordenação
- 🎨 **Interface moderna** e responsiva
- 🛡️ **Tratamento de erros** robusto
- 📱 **Design responsivo** para mobile e desktop

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com Turbopack
- **React 19** - Biblioteca de interface
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **React Hot Toast** - Notificações
- **Radix UI** - Componentes acessíveis

### Backend
- **.NET 8** - Framework web
- **ASP.NET Core** - API REST
- **FluentValidation** - Validação de dados
- **AutoMapper** - Mapeamento de objetos
- **Swagger/OpenAPI** - Documentação da API
- **Clean Architecture** - Separação de responsabilidades

## 🏗️ Arquitetura

### Backend - Clean Architecture

```
📁 ProductManagement.API (Presentation Layer)
├── Controllers/          # Endpoints REST
├── Middlewares/          # Middleware de tratamento de erros
└── Program.cs           # Configuração da aplicação

📁 ProductManagement.Application (Application Layer)
├── DTOs/                # Data Transfer Objects
├── Interfaces/           # Contratos de serviços
├── Services/            # Lógica de aplicação
├── Mappers/             # Perfis do AutoMapper
└── Validators/          # Validações com FluentValidation

📁 ProductManagement.Domain (Domain Layer)
├── Entities/            # Entidades de domínio
├── Interfaces/          # Contratos de repositórios
└── Exceptions/          # Exceções customizadas

📁 ProductManagement.Infrastructure (Infrastructure Layer)
└── Repositories/        # Implementação de repositórios
```

### Frontend - Component Architecture

```
📁 src/
├── app/
│   ├── components/
│   │   ├── base/        # Componentes base reutilizáveis
│   │   ├── features/    # Componentes específicos de funcionalidades
│   │   └── shared/      # Componentes compartilhados
│   ├── layouts/         # Layouts da aplicação
│   └── page.tsx         # Página principal
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── services/            # Serviços de API
└── types/               # Definições TypeScript
```

## 📁 Estrutura do Projeto

```
ProductManagement/
├── 📁 frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── base/       # Button, Input, Modal, etc.
│   │   │   │   ├── features/   # ProductTable, ProductModal, etc.
│   │   │   │   └── shared/     # DataTable, ConfirmModal, etc.
│   │   │   ├── layouts/        # Header
│   │   │   └── page.tsx        # Página principal
│   │   ├── hooks/              # useProdutos, useToast
│   │   ├── lib/                # http-client, error-handler, date-utils
│   │   ├── services/           # produtos.service
│   │   └── types/              # Definições TypeScript
│   ├── package.json
│   └── README.md
│
└── 📁 backend/                 # API .NET 8
    ├── src/
    │   ├── ProductManagement.API/        # Camada de apresentação
    │   ├── ProductManagement.Application/ # Camada de aplicação
    │   ├── ProductManagement.Domain/     # Camada de domínio
    │   └── ProductManagement.Infrastructure/ # Camada de infraestrutura
    ├── tests/                   # Testes unitários e de integração
    └── ProductManagement.sln    # Solution file
```

## 🚀 Como Executar

### Pré-requisitos

- **Node.js 18+** e **pnpm**
- **.NET 8 SDK**
- **Visual Studio 2022** ou **VS Code**

### Backend (.NET 8)

1. **Navegue para o diretório backend:**
   ```bash
   cd backend
   ```

2. **Restaure as dependências:**
   ```bash
   dotnet restore
   ```

3. **Execute a aplicação:**
   ```bash
   dotnet run --project src/ProductManagement.API
   ```

4. **Acesse a documentação da API:**
   - Swagger UI: `http://localhost:5228/swagger`
   - API Base: `http://localhost:5228/api`

### Frontend (Next.js 15)

1. **Navegue para o diretório frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Execute em modo desenvolvimento:**
   ```bash
   pnpm dev
   ```

4. **Acesse a aplicação:**
   - Frontend: `http://localhost:3000`

### Executando Ambos Simultaneamente

Para uma experiência completa, execute ambos os projetos:

```bash
# Terminal 1 - Backend
cd backend && dotnet run --project src/ProductManagement.API

# Terminal 2 - Frontend  
cd frontend && pnpm dev
```

## ⚡ Funcionalidades

### 🛍️ Gerenciamento de Produtos
- **Criar** novos produtos com validação
- **Listar** produtos com paginação
- **Editar** produtos existentes
- **Excluir** produtos com confirmação
- **Buscar** produtos por nome

### 🔍 Filtros e Ordenação
- **Filtro por categoria** (Eletrônicos, Roupas, Livros, etc.)
- **Filtro por status** (Disponível/Indisponível)
- **Filtro por faixa de preço** (mínimo e máximo)
- **Ordenação** por nome, categoria, preço, estoque, data
- **Paginação** com navegação intuitiva

### 🎨 Interface Moderna
- **Design responsivo** para todos os dispositivos
- **Componentes reutilizáveis** e escaláveis
- **Feedback visual** com loading states
- **Notificações** de sucesso/erro
- **Modais** para criação/edição
- **Confirmação** para exclusões

### 🛡️ Tratamento de Erros
- **Sistema escalável** de tratamento de erros
- **Mensagens amigáveis** ao usuário
- **Mapeamento automático** de erros técnicos
- **Validação** client-side e server-side

## 📡 API Endpoints

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/produtos` | Listar produtos com filtros e paginação |
| `GET` | `/api/produtos/{id}` | Buscar produto por ID |
| `POST` | `/api/produtos` | Criar novo produto |
| `PUT` | `/api/produtos/{id}` | Atualizar produto |
| `DELETE` | `/api/produtos/{id}` | Excluir produto |

### Parâmetros de Query

- `page` - Número da página (padrão: 1)
- `pageSize` - Itens por página (padrão: 10)
- `sortBy` - Campo para ordenação
- `sortOrder` - Direção da ordenação (asc/desc)
- `nome` - Filtro por nome
- `categoria` - Filtro por categoria
- `disponivel` - Filtro por disponibilidade
- `precoMin` - Preço mínimo
- `precoMax` - Preço máximo

## 🔮 Melhorias Futuras

### 🗄️ Persistência com Banco de Dados
- [ ] **Entity Framework Core** para ORM
- [ ] **SQL Server** ou **PostgreSQL** como banco principal
- [ ] **Migrations** para versionamento do schema
- [ ] **Connection pooling** para performance
- [ ] **Índices** otimizados para consultas

### 🏗️ CQRS para Processamento de Pedidos
- [ ] **Command Query Responsibility Segregation**
- [ ] **MediatR** para medição de comandos/queries
- [ ] **Event Sourcing** para auditoria
- [ ] **Read Models** otimizados para consultas
- [ ] **Command Handlers** para operações de escrita

### 👥 Controle de Usuário
- [ ] **Autenticação JWT** com refresh tokens
- [ ] **Autorização** baseada em roles/permissões
- [ ] **Identity Framework** para gerenciamento de usuários
- [ ] **Multi-tenancy** para múltiplas empresas
- [ ] **Auditoria** de ações do usuário

### 🚀 Performance e Escalabilidade
- [ ] **Redis** para cache distribuído
- [ ] **Background Services** para processamento assíncrono
- [ ] **Rate Limiting** para proteção da API
- [ ] **Health Checks** para monitoramento
- [ ] **Logging estruturado** com Serilog

### 📊 Monitoramento e Observabilidade
- [ ] **Application Insights** ou **OpenTelemetry**
- [ ] **Métricas** de performance
- [ ] **Alertas** automáticos
- [ ] **Dashboards** de monitoramento
- [ ] **Distributed tracing**

### 🔒 Segurança
- [ ] **HTTPS** obrigatório
- [ ] **CORS** configurado adequadamente
- [ ] **Validação** de entrada rigorosa
- [ ] **Sanitização** de dados
- [ ] **OWASP** compliance

---

**🎯 Objetivo**: Demonstrar uma arquitetura escalável e moderna para sistemas de gerenciamento, com foco em Clean Architecture, Domain-Driven Design e experiência do usuário excepcional.