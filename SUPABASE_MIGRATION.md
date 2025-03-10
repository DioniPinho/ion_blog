# Migração do Ion Blog para Supabase

Este documento descreve a migração do Ion Blog do backend Django para o Supabase, incluindo as alterações feitas e como usar o sistema atualizado.

## Visão Geral

O Ion Blog foi inicialmente projetado para usar o Django como backend, mas agora foi migrado para usar o Supabase como plataforma de backend. Esta migração inclui:

- Autenticação de usuários
- Gerenciamento de posts do blog
- Gerenciamento de categorias e tags
- Análise de visualizações e estatísticas

## Arquivos Modificados

### Novos Arquivos

- `src/lib/api/supabase-auth.ts`: Implementação de autenticação usando Supabase
- `src/lib/api/supabase-blog.ts`: Implementação de gerenciamento de posts, categorias e tags usando Supabase

### Arquivos Atualizados

- `src/app/dkkd/login/page.tsx`: Atualizado para usar autenticação Supabase
- `src/app/dkkd/dashboard/page.tsx`: Atualizado para usar a API Supabase para gerenciamento de posts
- `src/hooks/use-auth.ts`: Atualizado para usar a autenticação Supabase

## Configuração do Supabase

O Supabase já estava parcialmente configurado no projeto, como pode ser visto no arquivo `SUPABASE_SETUP.md`. As seguintes tabelas são usadas:

- `posts`: Armazena todos os posts do blog
- `categories`: Armazena categorias de posts
- `tags`: Armazena tags de posts

## Autenticação

A autenticação agora é gerenciada pelo Supabase Auth. Os usuários podem fazer login usando email e senha. O fluxo de autenticação é o seguinte:

1. O usuário acessa `/dkkd/login`
2. Após o login bem-sucedido, o usuário é redirecionado para `/dkkd/dashboard`
3. No dashboard, o usuário pode gerenciar posts, categorias e tags

### Implementação da Autenticação

A autenticação é implementada usando o cliente Supabase Auth. O arquivo `src/lib/api/supabase-auth.ts` contém as seguintes funções:

- `login(email, password)`: Autentica um usuário com email e senha
- `logout()`: Encerra a sessão do usuário
- `getMe()`: Obtém informações do usuário atual
- `isAuthenticated()`: Verifica se o usuário está autenticado
- `register(email, password, userData)`: Registra um novo usuário

## Gerenciamento de Posts

O gerenciamento de posts agora é feito através do Supabase. O arquivo `src/lib/api/supabase-blog.ts` contém as seguintes funções:

### Posts

- `getPosts()`: Obtém todos os posts
- `getPost(slug)`: Obtém um post específico pelo slug
- `createPost(data)`: Cria um novo post
- `updatePost(slug, data)`: Atualiza um post existente
- `deletePost(slug)`: Exclui um post

### Categorias

- `getCategories()`: Obtém todas as categorias
- `getCategory(slug)`: Obtém uma categoria específica pelo slug
- `createCategory(data)`: Cria uma nova categoria
- `updateCategory(slug, data)`: Atualiza uma categoria existente
- `deleteCategory(slug)`: Exclui uma categoria

### Tags

- `getTags()`: Obtém todas as tags
- `getTag(slug)`: Obtém uma tag específica pelo slug
- `createTag(data)`: Cria uma nova tag
- `updateTag(slug, data)`: Atualiza uma tag existente
- `deleteTag(slug)`: Exclui uma tag

## Análise e Estatísticas

O arquivo `src/lib/api/analytics.ts` já estava usando o Supabase para rastrear visualizações de posts e outras estatísticas. Ele continua funcionando da mesma forma, com as seguintes funcionalidades:

- Rastreamento de visualizações de posts
- Análise de categorias populares
- Dados de visitantes ao longo do tempo

## Modo de Desenvolvimento

Em modo de desenvolvimento, a aplicação usa dados simulados para facilitar o desenvolvimento e testes. Isso é controlado pela variável `isDevelopment` nos arquivos de API.

## Próximos Passos

1. Configurar usuários administrativos no Supabase
2. Implementar upload de imagens para posts usando o armazenamento do Supabase
3. Adicionar funcionalidades de comentários usando o Supabase Realtime

## Conclusão

A migração para o Supabase simplifica a infraestrutura do blog, eliminando a necessidade de manter um backend Django separado. Todas as funcionalidades principais do blog agora são gerenciadas através do Supabase, incluindo autenticação, gerenciamento de conteúdo e análise de dados.