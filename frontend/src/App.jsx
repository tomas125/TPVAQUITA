import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Verificar from './pages/Verificar'
import Inicio from './pages/Inicio'
import GrupoNuevo from './pages/GrupoNuevo'
import GastoNuevo from './pages/GastoNuevo'
import Saldos from './pages/Saldos'
import Invitar from './pages/Invitar'
import Unirse from './pages/Unirse'

// Páginas que necesitan sesión: si no hay token, va al login
function Privada({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  if (!localStorage.getItem('token')) {
    localStorage.setItem('volver', location.pathname) // para volver acá después del login (ej. /unirse/5)
    return <Navigate to="/login" />
  }

  const salir = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <header className="encabezado">
        <Link to="/" className="marca">🐮 Vaquita</Link>
        <div className="encabezado-usuario">
          <Link to="/grupos/nuevo" className="boton boton-chico boton-secundario">+ Grupo</Link>
          <button className="boton boton-chico boton-secundario" onClick={salir}>Salir</button>
        </div>
      </header>
      <main className="contenedor">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verificar" element={<Verificar />} />

        <Route path="/" element={<Privada><Inicio /></Privada>} />
        <Route path="/grupos/:id" element={<Privada><Inicio /></Privada>} />
        <Route path="/grupos/nuevo" element={<Privada><GrupoNuevo /></Privada>} />
        <Route path="/grupos/:id/gastos/nuevo" element={<Privada><GastoNuevo /></Privada>} />
        <Route path="/grupos/:id/saldos" element={<Privada><Saldos /></Privada>} />
        <Route path="/grupos/:id/invitar" element={<Privada><Invitar /></Privada>} />
        <Route path="/unirse/:id" element={<Privada><Unirse /></Privada>} />
      </Routes>
    </BrowserRouter>
  )
}
