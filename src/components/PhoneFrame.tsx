import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function PhoneFrame() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3FF' }}>
      <div
        className="relative mx-auto max-w-[420px] min-h-screen pb-20"
        style={{ backgroundColor: '#F7F3FF' }}
      >
        <Outlet />
        <BottomNav />
      </div>
    </div>
  )
}
