import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { moneda, textoError } from '../api'
import Icono from '../components/Iconos'
import Mascota from '../components/Mascota'
import { Avatar } from '../components/Avatar'
import { Aviso, Esqueleto } from '../components/Estados'

export default function GastoNuevo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [integrantes, setIntegrantes] = useState([])
  const [rubros, setRubros] = useState([])
  const [nombreGrupo, setNombreGrupo] = useState('')
  const [form, setForm] = useState({ pagadorId: '', importe: '', descripcion: '', rubroId: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const [grupo, resRubros, yo] = await Promise.all([
        api.get(`/grupos/${id}`),
        api.get('/rubros'),
        api.get('/usuarios/me'),
      ])
      setIntegrantes(grupo.data.integrantes)
      setNombreGrupo(grupo.data.descripcion)
      setRubros(resRubros.data)
      setForm((f) => ({ ...f, pagadorId: yo.data.id })) // por defecto pagó el usuario logueado
    }
    cargar()
  }, [id])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await api.post(`/grupos/${id}/gastos`, {
        pagadorId: Number(form.pagadorId),
        importe: Number(form.importe),
        descripcion: form.descripcion,
        rubroId: form.rubroId ? Number(form.rubroId) : null, // el rubro es opcional
      })
      navigate(`/grupos/${id}`, { state: { aviso: 'gasto' } })
    } catch (err) {
      setError(textoError(err))
      setEnviando(false)
    }
  }

  // Vista previa de la división (misma regla del backend: partes iguales entre integrantes)
  const importe = Number(form.importe) || 0
  const porPersona = integrantes.length > 0 ? importe / integrantes.length : 0

  return (
    <div className="pagina-form pagina-form--ancha">
      <Link to={`/grupos/${id}`} className="volver"><Icono nombre="flechaIzq" size={18} /> Volver al grupo</Link>

      <div className="encabezado-form">
        <h1 className="form-titulo">Nuevo gasto</h1>
        {nombreGrupo && <p className="form-bajada">En <strong>{nombreGrupo}</strong></p>}
      </div>

      {integrantes.length === 0 ? <Esqueleto filas={3} /> : (
        <form className="gasto" onSubmit={enviar}>
          {/* Visor tipo calculadora: el importe es lo más importante del formulario */}
          <div className="visor">
            <Mascota asomado expresion={importe > 0 ? 'feliz' : 'pensando'} size={130} className="visor-mascota" />
            <div className="visor-pantalla">
              <label htmlFor="gasto-importe" className="visor-label">Importe</label>
              <div className="visor-entrada">
                <span aria-hidden="true">$</span>
                <input id="gasto-importe" name="importe" type="number" inputMode="decimal" min="0.01" step="0.01"
                  placeholder="0,00" value={form.importe} onChange={cambiar} required
                  aria-describedby="gasto-division" />
              </div>
              <p id="gasto-division" className="visor-division">
                <Icono nombre="dividir" size={16} />
                <span>
                  {importe > 0
                    ? <>{moneda(importe)} ÷ {integrantes.length} = <strong>{moneda(porPersona)}</strong> cada uno</>
                    : <>Se divide en partes iguales entre {integrantes.length} integrantes</>}
                </span>
              </p>
            </div>
          </div>

          <div className="gasto-campos">
            <div className="campo">
              <label htmlFor="gasto-descripcion">Descripción</label>
              <input id="gasto-descripcion" name="descripcion" placeholder="Ej: Cena viernes" autoComplete="off"
                value={form.descripcion} onChange={cambiar} required />
            </div>

            <fieldset className="campo">
              <legend>¿Quién pagó?</legend>
              <div className="opciones">
                {integrantes.map((u) => (
                  <label key={u.id} className="opcion opcion--persona">
                    <input type="radio" name="pagadorId" value={u.id}
                      checked={String(form.pagadorId) === String(u.id)} onChange={cambiar} />
                    <Avatar id={u.id} texto={u.apodo} size="sm" />
                    <span>{u.apodo}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="campo">
              <legend>Rubro <span className="opcional">(opcional)</span></legend>
              <div className="opciones">
                <label className="opcion">
                  <input type="radio" name="rubroId" value="" checked={form.rubroId === ''} onChange={cambiar} />
                  <span>Sin rubro</span>
                </label>
                {rubros.map((r) => (
                  <label key={r.id} className="opcion">
                    <input type="radio" name="rubroId" value={r.id}
                      checked={String(form.rubroId) === String(r.id)} onChange={cambiar} />
                    <span>{r.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && <Aviso>{error}</Aviso>}

            <div className="form-acciones">
              <Link to={`/grupos/${id}`} className="boton boton--fantasma">Cancelar</Link>
              <button className="boton boton--primario boton--grande" disabled={enviando}>
                {enviando ? <span className="girando" aria-hidden="true" /> : <Icono nombre="check" />}
                <span>{enviando ? 'Guardando…' : 'Guardar gasto'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
