import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Produto } from '../lib/db'
import { getProdutos } from '../lib/db'
import { formatBRL } from '../lib/format'
import { getCategoryColor, abrirWhatsApp, LOJA_INFO } from '../lib/config'
import { ProductImage } from '../components/ProductImage'

const CATEGORIAS = [
  { nome: 'Roupas',     emoji: '👗' },
  { nome: 'Calçados',   emoji: '👟' },
  { nome: 'Acessórios', emoji: '🎀' },
]

export function Inicio() {
  const navigate = useNavigate()
  const [destaques, setDestaques] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProdutos()
      .then((produtos) => {
        setDestaques(produtos.filter((p) => p.estoque_atual > 0).slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          Bambole Kids
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {LOJA_INFO.descricao}
        </p>
      </div>

      {/* Banner gradiente */}
      <div
        className="rounded-3xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
      >
        <p className="text-xs font-medium uppercase tracking-widest opacity-80">Nova coleção</p>
        <h2 className="text-2xl font-bold mt-1">Coleção 2026</h2>
        <p className="text-sm opacity-80 mt-1">Moda infantil com todo o charme</p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-white font-semibold text-sm px-5 py-2 rounded-2xl"
            style={{ color: '#6D28D9' }}
          >
            Ver catálogo
          </button>
          <button
            onClick={() =>
              abrirWhatsApp('Olá! Gostaria de saber mais sobre a Bambolê Kids. 😊')
            }
            className="border border-white text-white font-semibold text-sm px-5 py-2 rounded-2xl"
          >
            WhatsApp
          </button>
        </div>
      </div>

      {/* Categorias */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#1F2937' }}>
          Categorias
        </h3>
        <div className="flex gap-4 justify-around">
          {CATEGORIAS.map(({ nome, emoji }) => {
            const { bg } = getCategoryColor(nome)
            return (
              <button
                key={nome}
                onClick={() =>
                  navigate(`/catalogo?categoria=${encodeURIComponent(nome)}`)
                }
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: bg }}
                >
                  {emoji}
                </div>
                <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                  {nome}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Destaque da semana — até 3 produtos em estoque */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#1F2937' }}>
          Destaque da semana
        </h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : destaques.length > 0 ? (
          <div className="space-y-3">
            {destaques.map((p) => (
              <div
                key={p.id_produto}
                className="rounded-3xl p-4 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ backgroundColor: '#FAFAFF', border: '1px solid #D8B4FE' }}
                onClick={() => navigate(`/produto/${p.id_produto}`)}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <ProductImage
                    path={p.imagem_path}
                    categoria={p.categoria}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: '#1F2937' }}>
                    {p.nome_produto}
                  </p>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>
                    {p.categoria}
                  </p>
                  <p className="font-bold" style={{ color: '#6D28D9' }}>
                    {formatBRL(p.preco_venda)}
                  </p>
                  <span className="text-xs font-medium text-green-600">• Em estoque</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Nenhum produto disponível no momento.
          </p>
        )}
      </div>
    </div>
  )
}
