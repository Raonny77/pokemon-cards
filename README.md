# Pokemon Cards

Aplicação Full Stack para gerenciamento de Cards Pokémon, feita com Next.js e NeonDB (PostgreSQL).

## Tecnologias

- Next.js 14 (App Router) — Frontend e Backend
- NeonDB (PostgreSQL) — banco de dados em nuvem
- Prisma ORM
- JWT (jsonwebtoken) + cookie httpOnly — autenticação e sessão
- bcryptjs — criptografia de senha

## Estrutura do projeto

```
pokemon-cards/
├── app/
│   ├── page.js                  → redireciona para /login ou /dashboard
│   ├── layout.js                → layout raiz
│   ├── globals.css              → estilos de toda a aplicação
│   ├── login/page.js            → tela de login
│   ├── cadastro/page.js         → tela de cadastro
│   ├── dashboard/page.js        → listagem/busca de cards
│   ├── cards/
│   │   ├── novo/page.js         → formulário de criação
│   │   └── [id]/editar/page.js  → formulário de edição
│   └── api/
│       ├── auth/
│       │   ├── register/route.js
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   └── me/route.js
│       └── cards/
│           ├── route.js         → listar (GET) e criar (POST)
│           └── [id]/route.js    → buscar, editar e excluir
├── components/
│   ├── Navbar.js
│   ├── CardItem.js
│   └── CardForm.js
├── lib/
│   ├── db.js                    → cliente Prisma
│   ├── auth.js                  → hash de senha e JWT
│   └── getUserFromRequest.js    → le o usuario logado pelo cookie
├── middleware.js                → protege as rotas /dashboard e /cards
├── prisma/
│   └── schema.prisma            → modelos User e Card
├── .env.example
└── README.md
```

## Passo a passo para rodar o projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Criar um banco no NeonDB

1. Crie uma conta gratuita em https://neon.tech
2. Crie um novo projeto/banco de dados
3. Copie a "Connection String" (URL de conexão) fornecida

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (baseado no `.env.example`):

```
DATABASE_URL="sua-connection-string-do-neondb"
JWT_SECRET="uma-string-secreta-qualquer"
```

### 4. Criar as tabelas no banco (Prisma)

```bash
npx prisma generate
npx prisma db push
```

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Funcionalidades

- Cadastro e login de usuário (senha criptografada com bcrypt)
- Autenticação via JWT armazenado em cookie httpOnly (controle de sessão)
- Rotas `/dashboard` e `/cards/*` protegidas pelo `middleware.js`
- CRUD completo de Cards Pokémon: criar, listar, editar e excluir
- Busca de card por nome
- Layout responsivo

## Observação sobre a imagem do card

Para manter o cadastro simples, o campo "Imagem do Pokémon" recebe uma **URL** da imagem (não é feito upload de arquivo). Você pode usar, por exemplo, links de imagens da PokéAPI (https://pokeapi.co) ou qualquer outra URL de imagem pública.
