import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { textoError } from '../api'

export default function GrupoNuevo() {
  const navigate = useNavigate()
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  const enviar = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/grupos', { descripcion })
      navigate(`/grupos/${res.data.id}`)
    } catch (err) {
      setError(textoError(err))
    }
  }

  return (
    <form className="formulario angosta" onSubmit={enviar}>
      <h2>Nuevo grupo</h2>
      <input placeholder="Ej: Mendoza 2025" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      <button className="boton">Crear</button>
    </form>
  )
}
