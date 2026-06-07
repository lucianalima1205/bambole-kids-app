import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LojaStats } from '../lib/db'
import { getLojaStats } from '../lib/db'
import { StatCard } from '../components/StatCard'

const VALORES = [
  {
    titulo: 'Qualidade garantida',
    desc: 'Produtos selecionados com carinho',
  },
  {
    titulo: 'Atendimento especial',
    desc: 'Sua família merece o melhor',
  },
  {
    titulo: 'Satisfação garantida',
    desc: 'Clientes satisfeitos em toda a comunidade',
  },
]

export function Sobre() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<LojaStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLojaStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 space-y-6 pt-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          Sobre nós
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          Conheça mais sobre a Bambole Kids.
        </p>
      </div>

      {/* Banner */}
      <div
        className="rounded-3xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
      >
        <h2 className="text-xl font-bold">A loja que mais cresce</h2>
        <p className="text-sm opacity-80 mt-1">
          Levando moda e carinho para famílias
        </p>
      </div>

      {/* Stats do banco */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#1F2937' }}>
          Nossos números
        </h3>
        {loading ? (
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 h-24 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <div className="flex gap-3">
            <StatCard
              label="Produtos"
              value={stats.total_produtos}
              bg="#FCE7F3"
              accent="#EC4899"
            />
            <StatCard
              label="Vendas"
              value={stats.total_vendas}
              bg="#D1FAE5"
              accent="#34D399"
            />
            <StatCard
              label="Desde"
              value={stats.ano_inicio}
              bg="#FEF3C7"
              accent="#F59E0B"
            />
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Não foi possível carregar os dados.
          </p>
        )}
      </div>

      {/* Valores */}
      <div
        className="rounded-3xl p-5 shadow-sm space-y-4"
        style={{ backgroundColor: '#FAFAFF', border: '1px solid #D8B4FE' }}
      >
        <h3 className="font-semibold" style={{ color: '#1F2937' }}>
          Nossos valores
        </h3>
        <div className="space-y-3">
          {VALORES.map(({ titulo, desc }) => (
            <div key={titulo} className="flex items-start gap-3">
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: '#6D28D9' }}
              />
              <div>
                <p className="font-medium text-sm" style={{ color: '#1F2937' }}>
                  {titulo}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/catalogo')}
        className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
        style={{ backgroundColor: '#6D28D9' }}
      >
        Conhecer produtos
      </button>
    </div>
  )
}
