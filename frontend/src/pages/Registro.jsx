import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { textoError } from '../api'

export default function Registro() {
  const [form, setForm] = useState({ apellido: '', nombre: '', apodo: '', email: '' })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState('')

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/registro', form)
      setLink(data.link ?? '')
      setMensaje('Te enviamos un mail con el link para ingresar')
    } catch (err) {
      setError(textoError(err))
    }
  }

  return (
    <div className="auth">
      <form className="auth-tarjeta formulario" onSubmit={enviar}>
        <h1>Crear cuenta</h1>
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={cambiar} required />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} required />
        <input name="apodo" placeholder="Apodo" value={form.apodo} onChange={cambiar} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={cambiar} required />
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="exito">{mensaje}</p>}
        {link && <a className="boton" href={link}>Ingresar (modo desarrollo)</a>}
        <button className="boton">Registrarme</button>
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </div>
  )
}
