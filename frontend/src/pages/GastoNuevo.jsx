import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { textoError } from '../api'

export default function GastoNuevo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [integrantes, setIntegrantes] = useState([])
  const [rubros, setRubros] = useState([])
  const [form, setForm] = useState({ pagadorId: '', importe: '', descripcion: '', rubroId: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      const [grupo, resRubros, yo] = await Promise.all([
        api.get(`/grupos/${id}`),
        api.get('/rubros'),
        api.get('/usuarios/me'),
      ])
      setIntegrantes(grupo.data.integrantes)
      setRubros(resRubros.data)
      setForm((f) => ({ ...f, pagadorId: yo.data.id })) // por defecto pagó el usuario logueado
    }
    cargar()
  }, [id])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/grupos/${id}/gastos`, {
        pagadorId: Number(form.pagadorId),
        importe: Number(form.importe),
        descripcion: form.descripcion,
        rubroId: form.rubroId ? Number(form.rubroId) : null, // el rubro es opcional
      })
      navigate(`/grupos/${id}`)
    } catch (err) {
      setError(textoError(err))
    }
  }

  return (
    <form className="formulario angosta" onSubmit={enviar}>
      <h2>Nuevo gasto</h2>
      <label>Pagó</label>
      <select name="pagadorId" value={form.pagadorId} onChange={cambiar}>
        {integrantes.map((u) => <option key={u.id} value={u.id}>{u.apodo}</option>)}
      </select>
      <label>Importe</label>
      <input name="importe" type="number" min="0.01" step="0.01" value={form.importe} onChange={cambiar} required />
      <label>Descripción</label>
      <input name="descripcion" placeholder="Ej: Cena viernes" value={form.descripcion} onChange={cambiar} required />
      <label>Rubro (opcional)</label>
      <select name="rubroId" value={form.rubroId} onChange={cambiar}>
        <option value="">Sin rubro</option>
        {rubros.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
      </select>
      {error && <p className="error">{error}</p>}
      <button className="boton">Guardar</button>
    </form>
  )
}
