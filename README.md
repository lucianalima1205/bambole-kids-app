# Bambolê Kids — Catálogo Digital

Aplicativo web (mobile-first) de catálogo digital para a loja de moda infantil
**Bambolê Kids**. É a vitrine voltada ao **cliente**: navegação pelos produtos,
detalhes, contato e informações da loja, com atendimento direcionado ao WhatsApp.

Os dados de produtos e estatísticas são lidos de um banco **PostgreSQL no Supabase**,
expostos de forma segura por meio de views públicas (somente leitura).

🔗 **Demo:** _<link da Vercel aqui após o deploy>_

---

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** — estilização
- **React Router** — navegação entre telas
- **Supabase** (`@supabase/supabase-js`) — leitura dos dados (PostgreSQL)
- **Vercel** — hospedagem

---

## Telas

| Rota            | Tela       | Descrição                                                        |
|-----------------|------------|------------------------------------------------------------------|
| `/`             | Início     | Apresentação, coleção em destaque, categorias e produto da semana |
| `/catalogo`     | Catálogo   | Lista de produtos com busca e filtro por categoria               |
| `/produto/:id`  | Detalhes   | Foto, preço, estoque, descrição e contato pelo WhatsApp          |
| `/contato`      | Contato    | Canal de WhatsApp e informações da loja                          |
| `/sobre`        | Sobre nós  | Apresentação da loja e estatísticas (produtos, vendas, ano)      |

---

## Modelo de dados

O app **não** acessa as tabelas diretamente. Ele consome apenas duas views
públicas, criadas no Supabase:

- **`produtos_publico`** — `id_produto`, `nome_produto`, `categoria`,
  `preco_venda`, `estoque_atual` (calculado), `imagem_path`.
  Não expõe o preço de custo.
- **`loja_stats`** — `total_produtos`, `total_vendas`, `ano_inicio`.

> O acesso direto às tabelas (`produtos`, `vendas`, `itens_venda`, `clientes`)
> é bloqueado por Row Level Security (RLS). O script `supabase_setup.sql`
> cria as views e aplica as permissões.

---

## Como rodar localmente

Pré-requisitos: **Node.js 18+** e um projeto no **Supabase** já configurado.

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env na raiz (ver seção abaixo)

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build de produção / pré-visualização
npm run build
npm run preview
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_WHATSAPP_NUMERO=5585999999999
```

> Use sempre a chave **`anon` / public** do Supabase — nunca a `service_role`.
> O arquivo `.env` não deve ser versionado (já está no `.gitignore`).

---

## Configuração do banco (Supabase)

1. Abra o **SQL Editor** no painel do Supabase.
2. Cole e execute o conteúdo de **`supabase_setup.sql`**.
3. Deixe o bucket **`produtos`** (Storage) como **público**, para as imagens
   carregarem.

---

## Deploy (Vercel)

1. Importe o repositório na Vercel (o preset **Vite** é detectado automaticamente).
2. Cadastre as variáveis de ambiente em **Settings → Environment Variables**:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_WHATSAPP_NUMERO`.
3. Deploy.

---

## Estrutura

```
src/
  lib/          # cliente Supabase, acesso a dados, config, formatação
  components/    # frame mobile, navegação, cards, imagem com fallback
  pages/         # Início, Catálogo, Detalhes, Contato, Sobre
  App.tsx        # rotas
  main.tsx
```

---

## Autoria

Desenvolvido por **Luciana** como atividade de extensão.
