import { supabase, supabaseUrl } from './supabase'

export interface Produto {
  id_produto: number
  nome_produto: string
  categoria: string
  preco_venda: number
  estoque_atual: number
  imagem_path: string | null
}

export interface LojaStats {
  total_produtos: number
  total_vendas: number
  ano_inicio: number
}

export async function getProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase.from('produtos_publico').select('*')
  if (error) throw error
  return data ?? []
}

export async function getProdutoById(id: number): Promise<Produto | null> {
  const { data, error } = await supabase
    .from('produtos_publico')
    .select('*')
    .eq('id_produto', id)
    .single()
  if (error) {
    // PGRST116 = zero rows returned — produto não existe
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getLojaStats(): Promise<LojaStats> {
  const { data, error } = await supabase.from('loja_stats').select('*').single()
  if (error) throw error
  return data
}

export function imagemUrl(path: string | null): string | null {
  if (!path) return null
  return `${supabaseUrl}/storage/v1/object/public/produtos/${path}`
}
