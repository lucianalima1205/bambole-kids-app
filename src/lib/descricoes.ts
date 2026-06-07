import { normalizeText } from './format'

const DESCRICOES: Record<string, string> = {
  roupas:     'Peça leve e confortável, ideal para passeios, aniversários e o dia a dia.',
  calcados:   'Conforto e durabilidade pensados para acompanhar a criançada o dia todo.',
  acessorios: 'O detalhe especial que completa o look com todo o charme.',
}

const FALLBACK = 'Produto selecionado com carinho pela Bambolê Kids.'

export function getDescricao(categoria: string): string {
  return DESCRICOES[normalizeText(categoria)] ?? FALLBACK
}
