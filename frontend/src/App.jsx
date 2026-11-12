import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Verificar from './pages/Verificar'
import Inicio from './pages/Inicio'
import GrupoNuevo from './pages/GrupoNuevo'
import GastoNuevo from './pages/GastoNuevo'
import Saldos from './pages/Saldos'
import Invitar from './pages/Invitar'
import Unirse from './pages/Unirse'
import Encabezado from './components/Encabezado'

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
    <div className="app">
      <a href="#contenido" className="saltar">Saltar al contenido</a>
      <Encabezado onSalir={salir} />
      <main id="contenido" className="contenedor" tabIndex="-1">
        {/* La key reinicia la animación de entrada al cambiar de pantalla; los ids se ignoran
            para que pasar de un grupo a otro no remonte la vista ni vuelva a mostrar el esqueleto */}
        <div key={location.pathname.replace(/\d+/g, ':n')} className="pantalla">{children}</div>
      </main>
      <footer className="pie-app">
        <span className="pie-marca" translate="no">RATIFY</span>
        <span>Ni un peso más, ni un peso menos.</span>
      </footer>
    </div>
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
