import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Produto } from '../lib/db'
import { getProdutos } from '../lib/db'
import { normalizeText } from '../lib/format'
import { CategoryPill } from '../components/CategoryPill'
import { ProductCard } from '../components/ProductCard'

export function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaParam = searchParams.get('categoria') ?? ''

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState(categoriaParam || 'Todos')

  // Chips gerados a partir das categorias reais do banco
  const chips = useMemo(() => {
    const unicas = [...new Set(produtos.map((p) => p.categoria))].sort()
    return ['Todos', ...unicas]
  }, [produtos])

  // Sync filtro quando URL mudar (ex: vindo de Início)
  useEffect(() => {
    if (categoriaParam) setFiltro(categoriaParam)
    else setFiltro('Todos')
  }, [categoriaParam])

  useEffect(() => {
    getProdutos()
      .then(setProdutos)
      .catch(() => setErro(true))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = produtos.filter((p) => {
    const a = normalizeText(p.categoria)
    const b = normalizeText(filtro)
    // usa prefixo para cobrir singular/plural (ex: "roupa" bate com "roupas")
    const matchFiltro = filtro === 'Todos' || a === b || a.startsWith(b) || b.startsWith(a)
    const matchBusca = normalizeText(p.nome_produto).includes(normalizeText(busca))
    return matchFiltro && matchBusca
  })

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
          Catálogo
        </h1>
      </div>

      {/* Campo de busca */}
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar produto..."
        className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
        style={{
          backgroundColor: '#FAFAFF',
          border: '1px solid #D8B4FE',
          color: '#1F2937',
        }}
      />

      {/* Chips gerados do banco */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {chips.map((f) => (
          <CategoryPill
            key={f}
            label={f}
            categoria={f !== 'Todos' ? f : undefined}
            active={normalizeText(filtro) === normalizeText(f)}
            className="flex-shrink-0"
            onClick={() => {
              setFiltro(f)
              setSearchParams(f !== 'Todos' ? { categoria: f } : {})
            }}
          />
        ))}
      </div>

      {/* Lista de produtos */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-gray-100 animate-pulse h-20" />
          ))}
        </div>
      ) : erro ? (
        <p className="text-center text-red-500 py-8 text-sm">
          Erro ao carregar produtos. Tente novamente.
        </p>
      ) : filtrados.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: '#6B7280' }}>
          Nenhum produto encontrado.
        </p>
      ) : (
        <div className="space-y-3">
          {filtrados.map((p) => (
            <ProductCard key={p.id_produto} produto={p} />
          ))}
        </div>
      )}
    </div>
  )
}
