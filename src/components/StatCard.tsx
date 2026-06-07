interface Props {
  label: string
  value: number | string
  bg: string
  accent: string
}

export function StatCard({ label, value, bg, accent }: Props) {
  return (
    <div
      className="flex-1 rounded-3xl p-4 shadow-sm flex flex-col items-center gap-1"
      style={{ backgroundColor: bg }}
    >
      <span className="text-2xl font-bold" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  )
}
