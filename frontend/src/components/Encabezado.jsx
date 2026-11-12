import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Logo from './Logo'
import Icono from './Iconos'
import { Avatar } from './Avatar'

// Se guarda el usuario por token para no volver a pedirlo en cada cambio de página
let cache = { token: null, usuario: null }

export default function Encabezado({ onSalir }) {
  const token = localStorage.getItem('token')
  const [usuario, setUsuario] = useState(cache.token === token ? cache.usuario : null)

  useEffect(() => {
    if (cache.token === token && cache.usuario) return
    let vigente = true
    api.get('/usuarios/me')
      .then((res) => {
        cache = { token, usuario: res.data }
        if (vigente) setUsuario(res.data)
      })
      .catch(() => {}) // si falla, el header sigue funcionando sin el nombre
    return () => { vigente = false }
  }, [token])

  return (
    <header className="encabezado">
      <div className="encabezado-interior">
        <Link to="/" className="encabezado-marca" aria-label="RATIFY, ir al inicio">
          <Logo conEslogan size={38} />
        </Link>

        <nav className="encabezado-acciones" aria-label="Cuenta">
          <Link to="/grupos/nuevo" className="boton boton--primario boton--chico boton--icono-movil">
            <Icono nombre="mas" size={18} />
            <span>Nuevo grupo</span>
          </Link>
          {usuario && (
            <span className="sesion" title={usuario.email}>
              <Avatar id={usuario.id} texto={usuario.apodo} size="sm" />
              <span className="sesion-nombre">{usuario.apodo}</span>
            </span>
          )}
          <button type="button" className="boton boton--fantasma boton--chico boton--icono-movil" onClick={onSalir}>
            <Icono nombre="salir" size={18} />
            <span>Salir</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
