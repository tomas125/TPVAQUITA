import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { moneda, textoError } from '../api'
import Icono from '../components/Iconos'
import Mascota from '../components/Mascota'
import Modal from '../components/Modal'
import { Avatar } from '../components/Avatar'
import { Aviso, Confirmacion, Esqueleto, Sello } from '../components/Estados'

const fecha = (valor) =>
  new Date(valor).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

// Cuadro 1 (saldos) y Cuadro 2 (deudas) en la misma página
export default function Saldos() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resumen, setResumen] = useState(null)
  const [pagos, setPagos] = useState([])
  const [error, setError] = useState('')

  // Modales: deuda que se está pagando y confirmación de cierre
  const [deudaElegida, setDeudaElegida] = useState(null)
  const [importe, setImporte] = useState('')
  const [confirmarCierre, setConfirmarCierre] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [confirmado, setConfirmado] = useState('')

  const cargar = async () => {
    const [s, p] = await Promise.all([api.get(`/grupos/${id}/saldos`), api.get(`/grupos/${id}/pagos`)])
    setResumen(s.data)
    setPagos(p.data)
  }

  useEffect(() => {
    cargar()
  }, [id])

  const abrirPago = (deuda) => {
    setDeudaElegida(deuda)
    setImporte(String(deuda.importe)) // por defecto, el total de la deuda (se puede pagar una parte)
  }

  // Pago total o parcial de una deuda
  const pagar = async (e) => {
    e.preventDefault()
    if (!importe) return
    const deuda = deudaElegida
    setEnviando(true)
    try {
      await api.post(`/grupos/${id}/pagos`, {
        deudorId: deuda.deudorId,
        acreedorId: deuda.acreedorId,
        importe: Number(importe),
      })
      setError('')
      setDeudaElegida(null)
      setConfirmado(`Pago de ${moneda(Number(importe))} registrado`)
      cargar()
    } catch (err) {
      setError(textoError(err))
      setDeudaElegida(null)
    } finally {
      setEnviando(false)
    }
  }

  const cerrar = async () => {
    setEnviando(true)
    try {
      await api.post(`/grupos/${id}/cerrar`)
      navigate('/')
    } catch (err) {
      setError(textoError(err))
      setConfirmarCierre(false)
      setEnviando(false)
    }
  }

  if (!resumen) return <Esqueleto filas={5} />

  const hayDeudas = resumen.cuadro2.length > 0
  const maximo = Math.max(...resumen.cuadro1.map((s) => Math.abs(s.saldo)), 1)

  return (
    <div className="saldos">
      {confirmado && <Confirmacion mensaje={confirmado} onFin={() => setConfirmado('')} />}
      <Link to={`/grupos/${id}`} className="volver"><Icono nombre="flechaIzq" size={18} /> Volver al grupo</Link>

      <header className="saldos-cabecera">
        <h1>Saldos</h1>
        <dl className="saldos-cifras">
          <div className="saldos-cifra saldos-cifra--total">
            <dt>Total del grupo</dt>
            <dd className="importe">{moneda(resumen.total)}</dd>
          </div>
          <div className="saldos-cifra">
            <dt>Le toca a cada uno</dt>
            <dd className="importe">{moneda(resumen.cuotaPorPersona)}</dd>
          </div>
          <div className="saldos-cifra">
            <dt>Transferencias pendientes</dt>
            <dd>{resumen.cuadro2.length}</dd>
          </div>
        </dl>
      </header>

      {error && <Aviso>{error}</Aviso>}

      <div className="saldos-grilla">
        {/* Cuadro 2: lo que hay que hacer va primero */}
        <section className={`liquidacion ${hayDeudas ? '' : 'liquidacion--saldada'}`} aria-labelledby="deudas-titulo">
          <h2 id="deudas-titulo">Para quedar a mano</h2>
          {hayDeudas ? (
            <>
              <p className="panel-bajada">
                {resumen.cuadro2.length === 1
                  ? 'Con esta transferencia nadie le debe nada a nadie.'
                  : `Con estas ${resumen.cuadro2.length} transferencias nadie le debe nada a nadie.`}
              </p>
              <ul className="giros" role="list">
                {resumen.cuadro2.map((d, i) => (
                  <li key={`${d.deudorId}-${d.acreedorId}`} className="giro" style={{ '--i': i }}>
                    <span className="giro-persona">
                      <Avatar id={d.deudorId} texto={d.deudor} size="md" />
                      <span className="giro-nombre">{d.deudor}</span>
                    </span>
                    <span className="giro-flecha">
                      <span className="giro-importe importe">{moneda(d.importe)}</span>
                      <span className="giro-linea" aria-hidden="true" />
                      <span className="sr-only">le paga a</span>
                    </span>
                    <span className="giro-persona giro-persona--destino">
                      <Avatar id={d.acreedorId} texto={d.acreedor} size="md" />
                      <span className="giro-nombre">{d.acreedor}</span>
                    </span>
                    <button type="button" className="boton boton--primario boton--chico giro-boton" onClick={() => abrirPago(d)}>
                      <Icono nombre="billete" size={18} />
                      <span>Registrar pago</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="a-mano">
              <Mascota accesorio="sello" guino size={130} className="mascota--viva" />
              <div className="a-mano-texto">
                <Sello texto="Saldado" />
                <strong>Cuentas saldadas</strong>
                <p>No hay deudas pendientes. Ni un peso más, ni un peso menos.</p>
              </div>
            </div>
          )}
        </section>

        {/* Cuadro 1: balance divergente, a la izquierda lo que se debe y a la derecha lo que se tiene a favor */}
        <section className="panel" aria-labelledby="balance-titulo">
          <h2 id="balance-titulo">Balance por persona</h2>
          <p className="panel-bajada">Lo que pagó cada uno contra lo que le toca.</p>
          <div className="balance-ejes" aria-hidden="true">
            <span>Debe</span>
            <span>A favor</span>
          </div>
          <ul className="balance" role="list">
            {resumen.cuadro1.map((s, i) => {
              const estado = s.saldo < 0 ? 'debe' : s.saldo > 0 ? 'favor' : 'cero'
              const etiqueta = { debe: 'Debe', favor: 'A favor', cero: 'Al día' }[estado]
              return (
                <li key={s.usuarioId} className={`balance-fila balance-fila--${estado}`} style={{ '--i': i }}>
                  <Avatar id={s.usuarioId} texto={s.nombre} size="md" />
                  <div className="balance-persona">
                    <span className="balance-nombre">{s.nombre}</span>
                    <span className="balance-pago">Pagó {moneda(s.totalGastos)}</span>
                  </div>
                  <div className="balance-barra" aria-hidden="true">
                    <span style={{ '--ancho': `${(Math.abs(s.saldo) / maximo) * 50}%` }} />
                  </div>
                  <div className="balance-saldo">
                    <span className="estado">{etiqueta}</span>
                    <span className="importe">{moneda(s.saldo)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <section className="historial-bloque" aria-labelledby="pagos-titulo">
        <h2 id="pagos-titulo">Pagos realizados</h2>
        {pagos.length === 0 ? (
          <p className="panel-bajada">Todavía no se registró ningún pago. Cuando alguien pague, queda anotado acá.</p>
        ) : (
          <ol className="historial" role="list">
            {pagos.map((p) => (
              <li key={p.id}>
                <span className="historial-punto" aria-hidden="true"><Icono nombre="check" size={14} /></span>
                <span className="historial-texto">
                  <strong>{p.deudor}</strong> le pagó <strong className="importe">{moneda(p.importe)}</strong> a <strong>{p.acreedor}</strong>
                </span>
                {p.fecha && <time dateTime={p.fecha}>{fecha(p.fecha)}</time>}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="zona-cierre" aria-labelledby="cierre-titulo">
        <div>
          <h2 id="cierre-titulo">Cerrar grupo</h2>
          <p id="cierre-ayuda">
            {hayDeudas
              ? 'Se habilita cuando todos los saldos estén en cero.'
              : 'El grupo deja de admitir gastos y pagos, y sale de tu lista de grupos activos.'}
          </p>
        </div>
        <button type="button" className="boton boton--peligro" onClick={() => setConfirmarCierre(true)}
          disabled={hayDeudas} aria-describedby="cierre-ayuda">
          <Icono nombre="candado" size={18} />
          <span>Cerrar grupo</span>
        </button>
      </section>

      <Modal abierto={!!deudaElegida} onCerrar={() => !enviando && setDeudaElegida(null)} titulo="Registrar pago">
        {deudaElegida && (
          <form className="formulario" onSubmit={pagar}>
            <div className="modal-giro" aria-hidden="true">
              <Avatar id={deudaElegida.deudorId} texto={deudaElegida.deudor} size="md" />
              <span className="modal-giro-linea" />
              <Avatar id={deudaElegida.acreedorId} texto={deudaElegida.acreedor} size="md" />
            </div>
            <p className="modal-texto">
              ¿Cuánto le paga <strong>{deudaElegida.deudor}</strong> a <strong>{deudaElegida.acreedor}</strong>?
              La deuda es de <strong>{moneda(deudaElegida.importe)}</strong>; podés registrar una parte.
            </p>
            <div className="campo">
              <label htmlFor="pago-importe">Importe del pago</label>
              <div className="importe-entrada">
                <span aria-hidden="true">$</span>
                <input id="pago-importe" type="number" inputMode="decimal" step="0.01"
                  value={importe} onChange={(e) => setImporte(e.target.value)} required />
              </div>
            </div>
            <div className="form-acciones">
              <button type="button" className="boton boton--fantasma" onClick={() => setDeudaElegida(null)} disabled={enviando}>
                Cancelar
              </button>
              <button className="boton boton--primario" disabled={enviando || !importe}>
                {enviando && <span className="girando" aria-hidden="true" />}
                <span>{enviando ? 'Registrando…' : 'Registrar pago'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal abierto={confirmarCierre} onCerrar={() => !enviando && setConfirmarCierre(false)} titulo="¿Cerrar el grupo?">
        <p className="modal-texto">
          Después de cerrarlo no se pueden cargar gastos ni pagos, y deja de aparecer entre tus grupos activos.
        </p>
        <div className="form-acciones">
          <button type="button" className="boton boton--fantasma" onClick={() => setConfirmarCierre(false)} disabled={enviando}>
            Cancelar
          </button>
          <button type="button" className="boton boton--peligro" onClick={cerrar} disabled={enviando}>
            {enviando && <span className="girando" aria-hidden="true" />}
            <span>{enviando ? 'Cerrando…' : 'Sí, cerrar grupo'}</span>
          </button>
        </div>
      </Modal>
    </div>
  )
}
