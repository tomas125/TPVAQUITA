import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { textoError } from '../api'
import Mascota from '../components/Mascota'
import Icono from '../components/Iconos'
import { Aviso } from '../components/Estados'

export default function GrupoNuevo() {
  const navigate = useNavigate()
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      const res = await api.post('/grupos', { descripcion })
      navigate(`/grupos/${res.data.id}`, { state: { aviso: 'grupo' } })
    } catch (err) {
      setError(textoError(err))
      setEnviando(false)
    }
  }

  return (
    <div className="pagina-form">
      <Link to="/" className="volver"><Icono nombre="flechaIzq" size={18} /> Volver</Link>

      <div className="crear-grupo">
        {/* Rati sostiene un cartel con el nombre que se va escribiendo */}
        <div className="crear-grupo-escena" aria-hidden="true">
          <Mascota accesorio="cartel" cartel={descripcion} expresion={descripcion ? 'feliz' : 'pensando'}
            size={260} className="mascota--viva" />
        </div>

        <form className="formulario crear-grupo-form" onSubmit={enviar}>
          <div>
            <h1 className="form-titulo">Nuevo grupo</h1>
            <p className="form-bajada">
              Quedás como administrador. Después sumás a los demás desde <em>Invitar</em>.
            </p>
          </div>

          <div className="campo campo--protagonista">
            <label htmlFor="grupo-descripcion">Nombre del grupo</label>
            <input id="grupo-descripcion" placeholder="Ej: Mendoza 2025" maxLength={100} autoComplete="off"
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required
              aria-describedby="grupo-ayuda" />
            <span id="grupo-ayuda" className="campo-ayuda">Un viaje, la casa, el asado del sábado…</span>
          </div>

          {error && <Aviso>{error}</Aviso>}

          <button className="boton boton--primario boton--grande" disabled={enviando}>
            {enviando ? <span className="girando" aria-hidden="true" /> : <Icono nombre="mas" />}
            <span>{enviando ? 'Creando grupo…' : 'Crear grupo'}</span>
          </button>

          <ol className="mini-pasos" aria-label="Qué sigue">
            <li><strong>Ponele nombre</strong> al grupo.</li>
            <li><strong>Invitá</strong> a los demás con un QR o por mail.</li>
            <li><strong>Cargá gastos</strong> y RATIFY hace las cuentas.</li>
          </ol>
        </form>
      </div>
    </div>
  )
}
