# taskflow.

Um gerenciador de tarefas *full stack* focado em produtividade e design minimalista.

---

## 🎯 Sobre o projeto

O **taskflow.** é um sistema que permite aos usuários gerenciar suas tarefas diárias de forma eficiente. O seu backend foi feito do zero utilizando o módulo nativo `http` do Node.js, sem a utilização de frameworks tradicionais como o Express. 


## ✨ Funcionalidades

- **Autenticação segura (stateless):** sistema de login e registro próprio usando senhas criptografadas (Bcrypt) e Sessões via JSON Web Tokens (JWT).
- **Isolamento de dados:** cada usuário tem acesso exclusivo ao seu próprio quadro de tarefas (Multi-tenant básico via `user_id`).
- **Gerenciamento de tarefas:** operações completas de CRUD (Criar, Ler, Atualizar, Deletar).
- **Filtros e buscas avançadas:** busca textual, ordenação (mais recentes/mais antigas) e filtros combinados por *Tags*, *Status* (A fazer, Fazendo, Concluídas) e *Prioridades* (Baixa, Média, Alta).
- **Design moderno:**interface de usuário construída com React e Tailwind CSS, focada em UX/UI, com feedback visual responsivo e microinterações (Lucide Icons).

## 🛠️ Tecnologias utilizadas

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (estilização utilitária e responsiva)
- **Lucide React** (ícones modernos)

### Backend
- **Node.js** (módulo `http` nativo)
- **PostgreSQL** via [Supabase](https://supabase.com/)
- **Bcrypt** (criptografia de senhas)
- **JSON Web Token (JWT)** (autenticação e autorização)
- **pg-pool** (conexão e queries com o banco de dados)

---

## 🚀 Como executar localmente

### Pré-requisitos
- Node.js instalado na máquina.
- Um banco de dados PostgreSQL (recomenda-se criar um projeto gratuito no [Supabase](https://supabase.com/)).

### 1. Configuração do banco de dados
No painel SQL do seu banco (Supabase), execute o script abaixo para criar as tabelas necessárias:

```sql
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);
```

### 2. Configurando o ambiente
Este projeto exige configurações separadas para o Frontend e o Backend. Crie os arquivos `.env` baseados nos exemplos fornecidos:

**No Backend (`backend/.env`):**
```env
DATABASE_URL="sua-string-de-conexao-do-postgresql"
JWT_SECRET="uma-chave-secreta-bem-segura-e-longa"
```

**No Frontend (`frontend/.env`):**
```env
VITE_API_URL="http://localhost:8000"
```

### 3. Instalando e rodando o projeto

O projeto utiliza *workspaces* do NPM. Na raiz do projeto, instale as dependências:
```bash
npm install
```

Para rodar simultaneamente o Frontend e o Backend em ambiente de desenvolvimento, execute:
```bash
npm run dev
```

- **Frontend:** estará rodando em `http://localhost:5173`
- **Backend:** estará rodando em `http://localhost:8000`

---

## 🔒 Segurança

- **Proteção contra SQL Injection:** o backend utiliza queries parametrizadas (`$1, $2`) da biblioteca `pg` em todas as interações com o banco.
- **Middleware JWT:** todas as rotas de manipulação de tarefas (`/tasks`) passam por uma camada de segurança nativa que verifica a validade do token, rejeitando acessos não autorizados antes de atingir as regras de negócio ou o banco de dados.
- **Senhas irreversíveis:** nenhuma senha trafega em texto puro no banco de dados.
