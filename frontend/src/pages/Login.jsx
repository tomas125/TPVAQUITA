import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { textoError } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email })
      setLink(data.link ?? '')
      setMensaje('Te enviamos un mail con el link para ingresar')
    } catch (err) {
      setError(textoError(err))
    }
  }

  return (
    <div className="auth">
      <form className="auth-tarjeta formulario" onSubmit={enviar}>
        <h1>🐮 Vaquita</h1>
        <input type="email" placeholder="Tu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="exito">{mensaje}</p>}
        {link && <a className="boton" href={link}>Ingresar (modo desarrollo)</a>}
        <button className="boton">Recibir link</button>
        <Link to="/registro">Crear cuenta</Link>
      </form>
    </div>
  )
}
