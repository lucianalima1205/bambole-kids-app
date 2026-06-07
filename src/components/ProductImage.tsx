import { useState } from 'react'
import { imagemUrl } from '../lib/db'
import { getCategoryColor } from '../lib/config'

interface Props {
  path: string | null
  categoria: string
  className?: string
}

export function ProductImage({ path, categoria, className = '' }: Props) {
  const [hasError, setHasError] = useState(false)
  const url = imagemUrl(path)
  const { bg, accent } = getCategoryColor(categoria)

  if (!url || hasError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ backgroundColor: bg }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <span className="text-white text-xs font-semibold">Produto</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt=""
      className={`object-cover ${className}`}
      onError={() => setHasError(true)}
    />
  )
}
