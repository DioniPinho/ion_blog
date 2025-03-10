# Configurando o Supabase para o Ion Blog

Este guia irá ajudá-lo a configurar o Supabase para o projeto Ion Blog, incluindo a criação de uma conta, configuração do projeto e integração com a aplicação.

## 1. Criando uma conta no Supabase

1. Acesse [https://supabase.com/](https://supabase.com/) e clique em "Start your project" ou "Sign Up".
2. Você pode se cadastrar usando GitHub, GitLab, Google ou um email e senha.
3. Após o login, você será direcionado para o dashboard do Supabase.

## 2. Criando um novo projeto

1. No dashboard, clique em "New Project".
2. Selecione a organização (ou crie uma nova).
3. Preencha os detalhes do projeto:
   - **Nome do projeto**: `ion-blog` (ou outro nome de sua preferência)
   - **Database Password**: Crie uma senha forte e guarde-a em um local seguro
   - **Region**: Escolha a região mais próxima de você ou dos seus usuários
4. Clique em "Create New Project".
5. Aguarde alguns minutos enquanto o Supabase configura seu banco de dados.

## 3. Configurando as tabelas do banco de dados

Nosso projeto precisa de três tabelas principais: `posts`, `categories` e `tags`. Vamos criá-las usando o SQL Editor do Supabase.

1. No menu lateral, clique em "SQL Editor".
2. Clique em "New Query".
3. Cole o seguinte SQL para criar as tabelas necessárias:

```sql
-- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de posts com suporte a internacionalização
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  cover_image TEXT,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id TEXT NOT NULL,
  author_username TEXT NOT NULL,
  original_post_id UUID REFERENCES posts(id),
  UNIQUE(slug, locale)
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar políticas de acesso para as tabelas
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Políticas para posts (exemplo: todos podem ler, apenas autenticados podem editar)
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Posts are editable by authenticated users" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para categorias
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are editable by authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para tags
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Tags are editable by authenticated users" ON tags
  FOR ALL USING (auth.role() = 'authenticated');
```

4. Clique em "Run" para executar o SQL e criar as tabelas.

## 4. Configurando o Storage para imagens

1. No menu lateral, clique em "Storage".
2. Clique em "Create a new bucket".
3. Nomeie o bucket como "blog".
4. Marque a opção "Public bucket" para permitir acesso público às imagens.
5. Clique em "Create bucket".

## 5. Configurando a autenticação

1. No menu lateral, clique em "Authentication".
2. Em "Settings", verifique se o "Email Auth" está habilitado.
3. Opcionalmente, você pode configurar provedores de autenticação social como Google, GitHub, etc.
4. Em "URL Configuration", configure as URLs de redirecionamento para seu domínio local:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

## 6. Obtendo as credenciais da API

1. No menu lateral, clique em "Project Settings".
2. Clique em "API".
3. Aqui você encontrará:
   - **Project URL**: Este é o seu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Este é o seu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 7. Configurando as variáveis de ambiente no projeto

1. Na raiz do projeto, crie um arquivo chamado `.env.local` com o seguinte conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_public
```

2. Substitua `sua_url_do_projeto` e `sua_chave_anon_public` pelos valores obtidos no passo anterior.

## 8. Testando a conexão

1. Inicie o servidor de desenvolvimento com `npm run dev`.
2. Verifique se a conexão com o Supabase está funcionando corretamente.

## 9. Criando um usuário para testes

1. No menu lateral do Supabase, clique em "Authentication" e depois em "Users".
2. Clique em "Add User".
3. Preencha os detalhes do usuário:
   - Email: seu email
   - Password: uma senha forte
4. Clique em "Create User".
5. Para adicionar metadados ao usuário (como username, first_name, etc.), clique no usuário criado e adicione os seguintes metadados em formato JSON:

```json
{
  "username": "admin",
  "first_name": "Admin",
  "last_name": "User"
}
```

## Pronto!

Agora você tem o Supabase configurado e integrado ao seu projeto Ion Blog. Você pode fazer login, criar posts, categorias e tags, e testar todas as funcionalidades do blog.

## Recursos adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do supabase-js](https://supabase.com/docs/reference/javascript/introduction)
- [Exemplos de autenticação com Supabase e Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)