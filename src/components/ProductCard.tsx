import { useNavigate } from 'react-router-dom'
import type { Produto } from '../lib/db'
import { formatBRL } from '../lib/format'
import { getCategoryColor } from '../lib/config'
import { ProductImage } from './ProductImage'

interface Props {
  produto: Produto
}

export function ProductCard({ produto }: Props) {
  const navigate = useNavigate()
  const { accent } = getCategoryColor(produto.categoria)

  return (
    <div
      className="rounded-3xl shadow-sm p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
      style={{ backgroundColor: '#FAFAFF', border: '1px solid #D8B4FE' }}
      onClick={() => navigate(`/produto/${produto.id_produto}`)}
    >
      <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
        <ProductImage
          path={produto.imagem_path}
          categoria={produto.categoria}
          className="w-full h-full"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800 truncate">{produto.nome_produto}</p>
        <p className="text-xs text-gray-500">{produto.categoria}</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: accent }}>
          {formatBRL(produto.preco_venda)}
        </p>
      </div>

      <button
        className="text-xs px-3 py-1.5 rounded-2xl font-medium text-white flex-shrink-0"
        style={{ backgroundColor: accent }}
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/produto/${produto.id_produto}`)
        }}
      >
        Detalhes
      </button>
    </div>
  )
}
