# Assistente de IA — Bambolê Kids

Módulo de **assistente virtual** da loja de roupas infantis Bambolê Kids.
Faz parte do projeto de extensão (disciplina **Inteligência Artificial Para Devs**)
e estende o aplicativo de catálogo, adicionando um atendimento automatizado.

> Este é o módulo da **Parte 3**. O aplicativo de catálogo (Parte 2) está na
> raiz do repositório.

---

## O que faz

Uma assistente conversacional que atende o cliente da loja pelo chat:

- Responde dúvidas sobre os produtos de forma acolhedora.
- Pergunta o que a pessoa procura (categoria, tamanho, ocasião).
- Consulta o **estoque real** da loja e lista apenas o que está disponível.
- Informa preços e disponibilidade **sem inventar** — usa só o catálogo real.
- Mantém a conversa no escopo da loja (moda infantil).

O coração do módulo é a **Engenharia de Prompt**: um *System Prompt* que define
a persona, as regras de comportamento e injeta o catálogo como única fonte de verdade.

---

## Como funciona (arquitetura)

```
Tela de chat (React)
      │  POST /api/chat  { messages: [...] }
      ▼
Função serverless /api/chat  (roda no servidor, na Vercel)
      │  1. busca os produtos em "produtos_publico" (Supabase)
      │  2. monta o System Prompt com o catálogo + regras
      │  3. chama o modelo de IA (Gemini) com a chave secreta
      ▼
Resposta da IA  →  volta pro chat
```

- O navegador **nunca** fala direto com a IA — sempre passa pela função `/api/chat`,
  que guarda a chave da API em segurança (fora do código do front).
- A assistente usa o mesmo banco (Supabase) do aplicativo de catálogo, garantindo
  que estoque e preços estejam sempre corretos.

---

## Estrutura deste módulo

```
assistente-ia/
├── README.md          # este arquivo
├── Assistente.tsx     # a tela de chat (interface React)
└── chat.ts            # cliente que envia as mensagens para /api/chat
```

> ⚠️ **Nota sobre a função serverless:** o backend da IA fica em **`/api/chat.ts`,
> na raiz do repositório** — e não dentro desta pasta. Isso é uma exigência da
> Vercel, que só reconhece funções serverless na pasta `/api` da raiz do projeto.

---

## Tecnologias

- **React** (interface do chat) — integrada ao app principal (Vite)
- **Vercel Serverless Function** (`/api/chat`) — backend que protege a chave da IA
- **Google Gemini** — modelo de linguagem (free tier)
- **Supabase (PostgreSQL)** — fonte do catálogo e do estoque

---

## Como rodar localmente

A IA depende da função serverless, que o servidor padrão do Vite **não** executa.
Use a Vercel CLI:

```bash
# 1. Instalar a Vercel CLI (uma vez)
npm i -g vercel

# 2. Rodar o projeto com as funções serverless ativas
vercel dev
```

### Variáveis de ambiente necessárias

No `.env` (local) e nas Environment Variables da Vercel (produção):

```env
# já usadas pelo app de catálogo:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# nova, exclusiva da IA (SECRETA — sem o prefixo VITE_):
GEMINI_API_KEY=...
```

> A `GEMINI_API_KEY` **nunca** leva o prefixo `VITE_`. Isso é proposital: o que
> tem `VITE_` é enviado ao navegador. A chave da IA precisa ficar só no servidor.

A chave do Gemini é gratuita: **[aistudio.google.com](https://aistudio.google.com) → Get API key**.

---

## Acesso no app

Com o projeto rodando, a assistente fica disponível na rota **`/assistente`**
e no ícone ✨ da barra de navegação inferior.
