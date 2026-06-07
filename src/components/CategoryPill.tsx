import { getCategoryColor } from '../lib/config'

interface Props {
  label: string
  categoria?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryPill({ label, categoria, active, onClick, className = '' }: Props) {
  const { bg, accent } = categoria
    ? getCategoryColor(categoria)
    : { bg: '#EDE9FE', accent: '#6D28D9' }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${className}`}
      style={active ? { backgroundColor: accent, color: '#fff' } : { backgroundColor: bg, color: accent }}
    >
      {label}
    </button>
  )
}
