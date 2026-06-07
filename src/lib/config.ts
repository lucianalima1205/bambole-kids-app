import { normalizeText } from './format'

export const WHATSAPP_NUMERO =
  (import.meta.env.VITE_WHATSAPP_NUMERO as string | undefined) ?? '5585999999999'

export const LOJA_INFO = {
  nome: 'Bambole Kids',
  descricao: 'Moda infantil com carinho para o dia a dia.',
  responsavel: 'Dona Bruna Sousa',
  endereco: 'Rua Umuarama, 284 — Granja Lisboa',
  horario: 'Segunda a sábado, 8h às 18h',
  pagamento: 'Pix, cartão e dinheiro',
}

// Cores do mockup — chaves já normalizadas (sem acento, lowercase)
const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  roupas:     { bg: '#FCE7F3', accent: '#EC4899' },
  calcados:   { bg: '#D1FAE5', accent: '#34D399' },
  acessorios: { bg: '#FEF3C7', accent: '#F59E0B' },
}

const FALLBACK_COLOR = { bg: '#EDE9FE', accent: '#6D28D9' }

export function getCategoryColor(categoria: string): { bg: string; accent: string } {
  return CATEGORY_COLORS[normalizeText(categoria)] ?? FALLBACK_COLOR
}

export function abrirWhatsApp(mensagem: string): void {
  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`,
    '_blank',
  )
}
