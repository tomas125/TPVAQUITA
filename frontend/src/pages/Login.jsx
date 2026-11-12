import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { textoError } from '../api'
import AuthMarco from '../components/AuthMarco'
import Icono from '../components/Iconos'
import { Aviso } from '../components/Estados'

export default function Login() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const { data } = await api.post('/auth/login', { email })
      setLink(data.link ?? '')
      setMensaje('Te enviamos un mail con el link para ingresar')
    } catch (err) {
      setError(textoError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthMarco>
      <form className="formulario auth-form" onSubmit={enviar}>
        <div>
          <h1 className="form-titulo">Ingresar</h1>
          <p className="form-bajada">Sin contraseñas: te mandamos un link de un solo uso a tu mail.</p>
        </div>

        <div className="campo">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" spellCheck={false} placeholder="vos@ejemplo.com" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {error && <Aviso>{error}</Aviso>}
        {mensaje && <Aviso tipo="exito">{mensaje}</Aviso>}
        {link && <a className="boton boton--secundario" href={link}>Ingresar (modo desarrollo)</a>}

        <button className="boton boton--primario boton--grande" disabled={enviando}>
          {enviando ? <span className="girando" aria-hidden="true" /> : <Icono nombre="mail" />}
          <span>{enviando ? 'Enviando…' : 'Recibir link'}</span>
        </button>

        <p className="auth-alternativa">¿Primera vez? <Link to="/registro">Crear cuenta</Link></p>
      </form>
    </AuthMarco>
  )
}
