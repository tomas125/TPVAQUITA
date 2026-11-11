import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { moneda } from '../api'

// Vista principal: desplegable de grupos activos + gastos del grupo
export default function Inicio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grupos, setGrupos] = useState([])
  const [grupoId, setGrupoId] = useState(null)
  const [gastos, setGastos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const resGrupos = await api.get('/grupos') // solo los activos
      setGrupos(resGrupos.data)

      // Grupo a mostrar: el de la URL, o el último usado, o el primero
      let elegido = id ? Number(id) : null
      if (!elegido) {
        const yo = await api.get('/usuarios/me')
        const ultimo = yo.data.ultimoGrupoId
        elegido = resGrupos.data.some((g) => g.id === ultimo) ? ultimo : resGrupos.data[0]?.id
      }

      if (elegido) {
        await api.get(`/grupos/${elegido}`) // el backend lo guarda como "último grupo"
        const resGastos = await api.get(`/grupos/${elegido}/gastos`)
        setGastos(resGastos.data)
      }
      setGrupoId(elegido ?? null)
      setCargando(false)
    }
    cargar()
  }, [id])

  if (cargando) return <p className="centrado">Cargando…</p>

  if (grupos.length === 0)
    return (
      <div className="vacio">
        <p>No tenés grupos activos.</p>
        <Link to="/grupos/nuevo" className="boton">Crear grupo</Link>
      </div>
    )

  const total = gastos.reduce((suma, g) => suma + g.importe, 0)

  return (
    <>
      <select value={grupoId ?? ''} onChange={(e) => navigate(`/grupos/${e.target.value}`)}>
        {grupos.map((g) => <option key={g.id} value={g.id}>{g.descripcion}</option>)}
      </select>

      <div className="acciones">
        <Link to={`/grupos/${grupoId}/gastos/nuevo`} className="boton">+ Gasto</Link>
        <Link to={`/grupos/${grupoId}/saldos`} className="boton boton-secundario">Saldos</Link>
        <Link to={`/grupos/${grupoId}/invitar`} className="boton boton-secundario">Invitar</Link>
      </div>

      <table>
        <thead>
          <tr><th>Usuario</th><th>Detalle</th><th>Rubro</th><th className="num">Importe</th></tr>
        </thead>
        <tbody>
          {gastos.map((g) => (
            <tr key={g.id}>
              <td>{g.pagador}</td>
              <td>{g.descripcion}</td>
              <td>{g.rubro ?? '-'}</td>
              <td className="num">{moneda(g.importe)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th colSpan="3">Total</th><th className="num">{moneda(total)}</th></tr>
        </tfoot>
      </table>
    </>
  )
}
