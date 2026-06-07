export type Mensagem = { role: 'user' | 'assistant'; content: string }

export async function enviarMensagem(messages: Mensagem[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const data = await res.json() as { reply?: string; error?: string }

  if (!res.ok || data.error) {
    throw new Error(data.error ?? 'Erro na comunicação')
  }

  return data.reply ?? ''
}
