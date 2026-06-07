import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PhoneFrame } from './components/PhoneFrame'
import { Inicio } from './pages/Inicio'
import { Catalogo } from './pages/Catalogo'
import { Detalhes } from './pages/Detalhes'
import { Contato } from './pages/Contato'
import { Sobre } from './pages/Sobre'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PhoneFrame />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/produto/:id" element={<Detalhes />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre" element={<Sobre />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
