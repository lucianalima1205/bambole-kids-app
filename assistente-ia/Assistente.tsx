import { useEffect, useRef, useState } from 'react'
import { type Mensagem, enviarMensagem } from './chat'

const SAUDACAO: Mensagem = {
  role: 'assistant',
  content:
    'Oi! 😊 Sou a assistente da Bambolê Kids. Posso te ajudar a encontrar roupinhas, calçados e acessórios infantis. O que você está procurando hoje?',
}

export default function Assistente() {
  const [messages, setMessages] = useState<Mensagem[]>([SAUDACAO])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function enviar() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Mensagem = { role: 'user', content: text }
    const history: Mensagem[] = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const reply = await enviarMensagem(history)
      setMessages([...history, { role: 'assistant', content: reply }])
    } catch {
      setMessages([
        ...history,
        { role: 'assistant', content: 'Tive um probleminha, pode repetir? 😅' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="p-4 pt-6 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}>
        <h1 className="text-xl font-bold text-white">Assistente Bambolê</h1>
        <p className="text-xs text-white mt-0.5" style={{ opacity: 0.8 }}>
          Tire suas dúvidas sobre nossos produtos
        </p>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.role === 'user'
                  ? { backgroundColor: '#6D28D9', color: '#fff' }
                  : { backgroundColor: '#FAFAFF', color: '#1F2937', border: '1px solid #D8B4FE' }
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-2.5 text-sm"
              style={{ backgroundColor: '#FAFAFF', color: '#6B7280', border: '1px solid #D8B4FE' }}
            >
              digitando...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex gap-2 p-3 flex-shrink-0"
        style={{ borderTop: '1px solid #D8B4FE', backgroundColor: '#FAFAFF' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Digite sua mensagem..."
          disabled={loading}
          className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
          style={{ border: '1px solid #D8B4FE', backgroundColor: '#fff', color: '#1F2937' }}
        />
        <button
          onClick={enviar}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: '#6D28D9' }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
