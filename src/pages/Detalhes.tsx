import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Produto } from '../lib/db'
import { getProdutoById } from '../lib/db'
import { formatBRL } from '../lib/format'
import { abrirWhatsApp } from '../lib/config'
import { getDescricao } from '../lib/descricoes'
import { ProductImage } from '../components/ProductImage'

export function Detalhes() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // undefined = carregando, null = não encontrado, Produto = ok
  const [produto, setProduto] = useState<Produto | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setProduto(null)
      setLoading(false)
      return
    }
    getProdutoById(Number(id))
      .then(setProduto)
      .catch(() => setProduto(null))
      .finally(() => setLoading(false))
  }, [id])

  const emEstoque = produto != null && produto.estoque_atual > 0

  const mensagem = produto
    ? emEstoque
      ? `Olá! Tenho interesse no produto *${produto.nome_produto}* (${formatBRL(produto.preco_venda)}). Ainda está disponível?`
      : `Olá! Quero ser avisado(a) quando o produto *${produto.nome_produto}* voltar ao estoque.`
    : ''

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate('/catalogo')}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: '#6D28D9' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Catálogo
        </button>
      </div>

      {loading ? (
        <div className="p-4 space-y-4">
          <div className="w-full h-64 rounded-3xl bg-gray-100 animate-pulse" />
          <div className="h-6 bg-gray-100 animate-pulse rounded-xl" />
          <div className="h-4 bg-gray-100 animate-pulse rounded-xl w-1/2" />
          <div className="h-4 bg-gray-100 animate-pulse rounded-xl w-3/4" />
        </div>
      ) : produto == null ? (
        <div className="p-4 text-center py-16">
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Produto não encontrado.
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="mt-4 text-sm font-medium"
            style={{ color: '#6D28D9' }}
          >
            Voltar ao catálogo
          </button>
        </div>
      ) : (
        <>
          {/* Imagem */}
          <div className="px-4">
            <div className="w-full h-64 rounded-3xl overflow-hidden">
              <ProductImage
                path={produto.imagem_path}
                categoria={produto.categoria}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Informações */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>
                  {produto.nome_produto}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                  Categoria: {produto.categoria}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 flex-shrink-0 ${
                  emEstoque
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {emEstoque ? 'Em estoque' : 'Esgotado'}
              </span>
            </div>

            <p className="text-2xl font-bold" style={{ color: '#6D28D9' }}>
              {formatBRL(produto.preco_venda)}
            </p>

            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              {getDescricao(produto.categoria)}
            </p>

            {/* Botões */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => abrirWhatsApp(mensagem)}
                className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
                style={{ backgroundColor: '#6D28D9' }}
              >
                {emEstoque ? 'Tenho interesse' : 'Avise-me quando voltar'}
              </button>
              <button
                onClick={() => abrirWhatsApp(mensagem)}
                className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
                style={{ backgroundColor: '#22C55E' }}
              >
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
