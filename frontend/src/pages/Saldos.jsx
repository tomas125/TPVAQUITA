import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { moneda, textoError } from '../api'

// Cuadro 1 (saldos) y Cuadro 2 (deudas) en la misma página
export default function Saldos() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resumen, setResumen] = useState(null)
  const [pagos, setPagos] = useState([])
  const [error, setError] = useState('')

  const cargar = async () => {
    const [s, p] = await Promise.all([api.get(`/grupos/${id}/saldos`), api.get(`/grupos/${id}/pagos`)])
    setResumen(s.data)
    setPagos(p.data)
  }

  useEffect(() => {
    cargar()
  }, [id])

  // Pago total o parcial de una deuda
  const pagar = async (deuda) => {
    const importe = window.prompt(`¿Cuánto le paga ${deuda.deudor} a ${deuda.acreedor}?`, deuda.importe)
    if (!importe) return
    try {
      await api.post(`/grupos/${id}/pagos`, {
        deudorId: deuda.deudorId,
        acreedorId: deuda.acreedorId,
        importe: Number(importe),
      })
      setError('')
      cargar()
    } catch (err) {
      setError(textoError(err))
    }
  }

  const cerrar = async () => {
    if (!window.confirm('¿Cerrar el grupo?')) return
    try {
      await api.post(`/grupos/${id}/cerrar`)
      navigate('/')
    } catch (err) {
      setError(textoError(err))
    }
  }

  if (!resumen) return <p className="centrado">Cargando…</p>

  const hayDeudas = resumen.cuadro2.length > 0

  return (
    <>
      <h2>Saldos</h2>
      <table>
        <thead>
          <tr><th>Persona</th><th className="num">Total gastos</th><th className="num">Saldo</th></tr>
        </thead>
        <tbody>
          {resumen.cuadro1.map((s) => (
            <tr key={s.usuarioId}>
              <td>{s.nombre}</td>
              <td className="num">{moneda(s.totalGastos)}</td>
              <td className={`num ${s.saldo < 0 ? 'negativo' : 'positivo'}`}>{moneda(s.saldo)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th>Total</th><th className="num">{moneda(resumen.total)}</th><th className="num">({moneda(resumen.cuotaPorPersona)} c/u)</th></tr>
        </tfoot>
      </table>

      <h2>Deudas</h2>
      {!hayDeudas && <p className="tenue">No hay deudas pendientes.</p>}
      <table>
        <tbody>
          {resumen.cuadro2.map((d) => (
            <tr key={`${d.deudorId}-${d.acreedorId}`}>
              <td>{d.deudor} &gt; {d.acreedor}</td>
              <td className="num">{moneda(d.importe)}</td>
              <td className="num"><button className="boton boton-chico" onClick={() => pagar(d)}>Registrar pago</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pagos realizados</h2>
      <ul>
        {pagos.map((p) => <li key={p.id}>{p.deudor} le pagó {moneda(p.importe)} a {p.acreedor}</li>)}
      </ul>

      {error && <p className="error">{error}</p>}
      <button className="boton boton-peligro" onClick={cerrar} disabled={hayDeudas}>Cerrar grupo</button>
    </>
  )
}
