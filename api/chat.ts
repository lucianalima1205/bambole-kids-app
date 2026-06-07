// Vercel Edge Function — chave do Gemini fica SÓ aqui, nunca vai ao front
export const config = { runtime: 'edge' }

// process.env existe no Vercel Edge Runtime
declare const process: { env: Record<string, string | undefined> }

const GEMINI_MODEL = 'gemini-3.1-flash-lite'

const SYSTEM_PROMPT = `Você é a assistente virtual da Bambolê Kids, uma loja de roupas infantis de bairro.
Seu tom é acolhedor, gentil e simples, falando com mães, pais e cuidadores. Use
português brasileiro claro, sem termos técnicos. Pode usar no máximo um emoji por
mensagem, com moderação.

SEU PAPEL:
- Ajudar o cliente a encontrar produtos infantis (roupas, calçados e acessórios).
- Perguntar o que a pessoa procura, para qual idade/tamanho e a ocasião, quando
  fizer sentido, para recomendar melhor.
- Informar preço e disponibilidade APENAS com base no catálogo abaixo.

REGRAS IMPORTANTES (não quebre):
- Use SOMENTE os produtos da lista abaixo. NUNCA invente produtos, preços ou tamanhos.
- Só ofereça itens marcados como EM ESTOQUE. Se o cliente pedir algo ESGOTADO,
  avise com gentileza e sugira uma alternativa parecida que esteja disponível.
- Se perguntarem algo que não está na lista, diga educadamente que no momento não
  trabalhamos com aquilo.
- Não prometa prazos de entrega, descontos ou formas de pagamento que você não sabe.
  Para fechar a compra ou tratar de pagamento/entrega, oriente o cliente a falar
  com a loja pelo WhatsApp.
- Se a pergunta fugir do assunto da loja, traga a conversa de volta com simpatia.
- Seja breve: respostas curtas e fáceis de ler no celular.

INFORMAÇÕES DA LOJA:
- Horário: segunda a sábado, das 8h às 18h.
- Pagamento: Pix, cartão e dinheiro.

CATÁLOGO ATUAL (única fonte de verdade sobre produtos e estoque):
{CATALOGO}`

type Msg = { role: string; content: string }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await req.json() as { messages?: Msg[] }
  const messages = body.messages

  if (!messages?.length) {
    return Response.json({ error: 'messages é obrigatório' }, { status: 400 })
  }

  // Busca catálogo real do Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? ''
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? ''

  const produtosRes = await fetch(
    `${supabaseUrl}/rest/v1/produtos_publico?select=*`,
    { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
  )

  const produtos = produtosRes.ok
    ? (await produtosRes.json() as Array<{
        nome_produto: string
        categoria: string
        preco_venda: number
        estoque_atual: number
      }>)
    : []

  const catalogo = produtos.map(p =>
    `- ${p.nome_produto} | ${p.categoria} | R$ ${p.preco_venda.toFixed(2).replace('.', ',')} | ${p.estoque_atual > 0 ? `EM ESTOQUE (${p.estoque_atual})` : 'ESGOTADO'}`
  ).join('\n')

  const systemInstruction = SYSTEM_PROMPT.replace('{CATALOGO}', catalogo || '(catálogo não disponível no momento)')

  // Converte histórico para o formato do Gemini
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const geminiKey = process.env.GEMINI_API_KEY ?? ''
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
      }),
    },
  )

  if (!geminiRes.ok) {
    console.error('Gemini error:', await geminiRes.text())
    return Response.json({ error: 'Erro ao chamar a IA' }, { status: 502 })
  }

  const geminiData = await geminiRes.json() as {
    candidates?: { content: { parts: { text: string }[] } }[]
  }

  const reply =
    geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
    'Não consegui responder agora, pode tentar de novo?'

  return Response.json({ reply })
}
