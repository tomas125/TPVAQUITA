import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { textoError } from '../api'
import AuthMarco from '../components/AuthMarco'
import Icono from '../components/Iconos'
import { Aviso } from '../components/Estados'

export default function Registro() {
  const [form, setForm] = useState({ apellido: '', nombre: '', apodo: '', email: '' })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const { data } = await api.post('/auth/registro', form)
      setLink(data.link ?? '')
      setMensaje('Te enviamos un mail con el link para ingresar')
    } catch (err) {
      setError(textoError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthMarco expresion="guino">
      <form className="formulario auth-form" onSubmit={enviar}>
        <div>
          <h1 className="form-titulo">Crear cuenta</h1>
          <p className="form-bajada">Tu apodo es cómo te van a ver los demás en los grupos.</p>
        </div>

        <div className="campos-par">
          <div className="campo">
            <label htmlFor="reg-nombre">Nombre</label>
            <input id="reg-nombre" name="nombre" autoComplete="given-name" maxLength={100}
              value={form.nombre} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="reg-apellido">Apellido</label>
            <input id="reg-apellido" name="apellido" autoComplete="family-name" maxLength={100}
              value={form.apellido} onChange={cambiar} required />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="reg-apodo">Apodo</label>
          <input id="reg-apodo" name="apodo" placeholder="Ej: Pepe" autoComplete="nickname" maxLength={50}
            value={form.apodo} onChange={cambiar} required />
        </div>
        <div className="campo">
          <label htmlFor="reg-email">Email</label>
          <input id="reg-email" name="email" type="email" spellCheck={false} placeholder="vos@ejemplo.com" autoComplete="email"
            value={form.email} onChange={cambiar} required />
        </div>

        {error && <Aviso>{error}</Aviso>}
        {mensaje && <Aviso tipo="exito">{mensaje}</Aviso>}
        {link && <a className="boton boton--secundario" href={link}>Ingresar (modo desarrollo)</a>}

        <button className="boton boton--primario boton--grande" disabled={enviando}>
          {enviando ? <span className="girando" aria-hidden="true" /> : <Icono nombre="check" />}
          <span>{enviando ? 'Creando cuenta…' : 'Registrarme'}</span>
        </button>

        <p className="auth-alternativa">¿Ya tenés cuenta? <Link to="/login">Ingresar</Link></p>
      </form>
    </AuthMarco>
  )
}
