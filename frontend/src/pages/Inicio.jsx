import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import api, { moneda } from '../api'
import Mascota from '../components/Mascota'
import Icono from '../components/Iconos'
import { Avatar, PilaAvatares } from '../components/Avatar'
import { Confirmacion, Esqueleto } from '../components/Estados'

const fecha = (valor) =>
  new Date(valor).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`

// Textos de la confirmación que llega desde otras pantallas (navigate con state)
const AVISOS = {
  gasto: 'Gasto cargado. Ya está en el ticket del grupo.',
  grupo: 'Grupo creado. Ahora invitá a los demás.',
}

// Vista principal: grupos activos + gastos del grupo elegido
export default function Inicio() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [grupos, setGrupos] = useState([])
  const [grupoId, setGrupoId] = useState(null)
  const [grupo, setGrupo] = useState(null)
  const [gastos, setGastos] = useState([])
  const [apodo, setApodo] = useState('')
  const [cargando, setCargando] = useState(true)
  const [cargandoGrupo, setCargandoGrupo] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      setCargandoGrupo(true)
      try {
        const resGrupos = await api.get('/grupos') // solo los activos
        setGrupos(resGrupos.data)

        // Grupo a mostrar: el de la URL, o el último usado, o el primero
        let elegido = id ? Number(id) : null
        if (!elegido) {
          const yo = await api.get('/usuarios/me')
          setApodo(yo.data.apodo ?? '')
          const ultimo = yo.data.ultimoGrupoId
          elegido = resGrupos.data.some((g) => g.id === ultimo) ? ultimo : resGrupos.data[0]?.id
        }

        if (elegido) {
          const resGrupo = await api.get(`/grupos/${elegido}`) // el backend lo guarda como "último grupo"
          const resGastos = await api.get(`/grupos/${elegido}/gastos`)
          setGrupo(resGrupo.data)
          setGastos(resGastos.data)
        }
        setGrupoId(elegido ?? null)
        setError(false)
      } catch {
        setError(true)
      } finally {
        setCargando(false)
        setCargandoGrupo(false)
      }
    }
    cargar()
  }, [id])

  const enInicio = !id
  const aviso = AVISOS[location.state?.aviso]
  // Borra el state para que la confirmación no reaparezca al volver con el navegador
  const limpiarAviso = () => navigate(location.pathname, { replace: true, state: null })

  const confirmacion = aviso && <Confirmacion mensaje={aviso} onFin={limpiarAviso} />

  if (cargando)
    return (
      <>
        {enInicio && <Banner apodo={apodo} />}
        <Esqueleto filas={4} />
      </>
    )

  if (error)
    return (
      <section className="estado-error">
        <Mascota accesorio="nada" expresion="sorpresa" size={130} />
        <div>
          <h1>No pudimos traer tus grupos</h1>
          <p>Revisá tu conexión y volvé a intentarlo.</p>
          <button type="button" className="boton boton--primario" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </section>
    )

  const listaGrupos = grupos.length > 0 && (
    <ListaGrupos grupos={grupos} grupoId={grupoId} titulo={enInicio ? 'Tus grupos' : 'Tus otros grupos'} />
  )

  return (
    <>
      {confirmacion}
      {enInicio && <Banner apodo={apodo} compacto={grupos.length > 0} />}

      {grupos.length === 0 && <EstadoVacio />}

      {enInicio && listaGrupos}

      {grupo && grupoId && (
        cargandoGrupo
          ? <Esqueleto filas={3} />
          : <DetalleGrupo grupo={grupo} gastos={gastos} esTitulo={!enInicio} />
      )}

      {!enInicio && listaGrupos}

      {enInicio && <ComoFunciona />}
    </>
  )
}

// ===== Banner de bienvenida =====
function Banner({ apodo, compacto = false }) {
  return (
    <section className={`banner ${compacto ? 'banner--compacto' : ''}`} aria-labelledby="banner-titulo">
      <div className="banner-texto">
        <p className="banner-saludo">{apodo ? `Hola, ${apodo}.` : 'Hola.'}</p>
        <h1 id="banner-titulo" className="banner-titulo">Dividí gastos, no amistades.</h1>
        <p className="banner-bajada">
          Cargá lo que pagó cada uno y RATIFY calcula cuánto le toca a cada persona y quién le tiene que
          transferir a quién.
        </p>
      </div>
      <div className="banner-ilustracion" aria-hidden="true">
        <span className="pila-monedas">
          <span /><span /><span /><span />
        </span>
        <Mascota accesorio="moneda" size={210} className="banner-mascota mascota--viva" />
      </div>
    </section>
  )
}

// ===== Estado vacío =====
function EstadoVacio() {
  return (
    <section className="vacio" aria-labelledby="vacio-titulo">
      <div className="vacio-ilustracion" aria-hidden="true">
        <Mascota accesorio="lupa" guino size={170} className="mascota--viva" />
      </div>
      <div className="vacio-texto">
        <h2 id="vacio-titulo">Todavía no hay cuentas que revisar</h2>
        <p>Creá un grupo para el viaje, la casa o el asado, sumá a los demás y empezá a cargar gastos.</p>
        <Link to="/grupos/nuevo" className="boton boton--primario boton--grande">
          <Icono nombre="mas" />
          <span>Crear mi primer grupo</span>
        </Link>
      </div>
    </section>
  )
}

// ===== Grupos: índice de fichas con pestaña de color =====
function ListaGrupos({ grupos, grupoId, titulo }) {
  return (
    <section className="seccion" aria-labelledby="grupos-titulo">
      <div className="seccion-cabecera">
        <h2 id="grupos-titulo">{titulo}</h2>
        <span className="contador">{plural(grupos.length, 'activo', 'activos')}</span>
      </div>
      <ul className="fichas" role="list">
        {grupos.map((g) => (
          <li key={g.id}>
            <FichaGrupo grupo={g} actual={g.id === grupoId} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function FichaGrupo({ grupo, actual }) {
  const n = grupo.integrantes?.length ?? 0
  return (
    <Link to={`/grupos/${grupo.id}`} className={`ficha motivo-${grupo.id % 4}`}
      aria-current={actual ? 'page' : undefined}>
      <span className="ficha-pestana" aria-hidden="true" />
      <span className="ficha-nombre">{grupo.descripcion}</span>
      <span className="ficha-pie">
        <PilaAvatares personas={grupo.integrantes ?? []} />
        <span className="ficha-cantidad">{plural(n, 'integrante', 'integrantes')}</span>
        {actual && <span className="ficha-actual">Abierto</span>}
      </span>
      {!actual && <Icono nombre="flechaDer" size={18} className="ficha-flecha" />}
    </Link>
  )
}

// ===== Detalle del grupo elegido =====
function DetalleGrupo({ grupo, gastos, esTitulo }) {
  const Titulo = esTitulo ? 'h1' : 'h2'
  const total = gastos.reduce((suma, g) => suma + g.importe, 0)
  const integrantes = grupo.integrantes ?? []
  const cuota = integrantes.length > 0 ? total / integrantes.length : 0

  return (
    <section className="grupo" aria-labelledby="grupo-titulo">
      <header className="grupo-cabecera">
        <div className="grupo-identidad">
          {!esTitulo && <p className="grupo-antetitulo">Grupo abierto</p>}
          <Titulo id="grupo-titulo" className="grupo-titulo">{grupo.descripcion}</Titulo>
          <p className="grupo-integrantes">
            <PilaAvatares personas={integrantes} max={6} size="md" />
            <span>{integrantes.map((u) => u.apodo).join(', ')}</span>
          </p>
        </div>
        <nav className="grupo-acciones" aria-label="Acciones del grupo">
          <Link to={`/grupos/${grupo.id}/gastos/nuevo`} className="boton boton--primario">
            <Icono nombre="mas" />
            <span>Cargar gasto</span>
          </Link>
          <Link to={`/grupos/${grupo.id}/saldos`} className="boton boton--secundario">
            <Icono nombre="balanza" />
            <span>Saldos</span>
          </Link>
          <Link to={`/grupos/${grupo.id}/invitar`} className="boton boton--secundario">
            <Icono nombre="qr" />
            <span>Invitar</span>
          </Link>
        </nav>
      </header>

      <div className="grupo-cuerpo">
        <article className="ticket" aria-labelledby="ticket-titulo">
          <div className="ticket-papel">
            <div className="ticket-cabecera">
              <h3 id="ticket-titulo">Gastos del grupo</h3>
              <span className="ticket-cantidad">{plural(gastos.length, 'gasto', 'gastos')}</span>
            </div>

            {gastos.length === 0 ? (
              <div className="ticket-vacio">
                <p>Todavía nadie cargó un gasto en este grupo.</p>
                <Link to={`/grupos/${grupo.id}/gastos/nuevo`} className="enlace-fuerte">Cargar el primero</Link>
              </div>
            ) : (
              <ul className="ticket-lista" role="list">
                {gastos.map((g, i) => (
                  <li key={g.id} className="ticket-item" style={{ '--i': i }}>
                    <Avatar id={g.pagadorId} texto={g.pagador} size="md" />
                    <div className="ticket-item-texto">
                      <span className="ticket-item-linea">
                        <span className="ticket-item-desc">{g.descripcion}</span>
                        <span className="ticket-puntos" aria-hidden="true" />
                        <span className="importe ticket-item-importe">{moneda(g.importe)}</span>
                      </span>
                      <span className="ticket-item-meta">
                        Pagó {g.pagador}
                        {g.rubro && <span className="chip">{g.rubro}</span>}
                        {g.fecha && <time dateTime={g.fecha}>{fecha(g.fecha)}</time>}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="ticket-total">
              <span>Total</span>
              <span className="importe">{moneda(total)}</span>
            </div>
          </div>
        </article>

        <aside className="resumen" aria-label="Resumen del grupo">
          <dl className="resumen-cifras">
            <div className="resumen-principal">
              <dt>Gastado entre todos</dt>
              <dd className="importe">{moneda(total)}</dd>
            </div>
            <div className="resumen-division" aria-hidden={integrantes.length === 0}>
              <dt>Le toca a cada uno</dt>
              <dd>
                <span className="importe">{moneda(cuota)}</span>
                <span className="resumen-formula">{moneda(total)} ÷ {integrantes.length}</span>
              </dd>
            </div>
          </dl>
          <Link to={`/grupos/${grupo.id}/saldos`} className="resumen-saldos">
            <Mascota accesorio="calculadora" expresion="pensando" size={78} />
            <span>
              <strong>¿Quién le debe a quién?</strong>
              <span>Ver saldos y transferencias</span>
            </span>
            <Icono nombre="flechaDer" className="resumen-flecha" />
          </Link>
        </aside>
      </div>
    </section>
  )
}

// ===== Cómo funciona (es una secuencia real, por eso va numerada) =====
const PASOS = [
  { icono: 'ticket', titulo: 'Registrá tus gastos', texto: 'Cada uno carga lo que pagó: importe, descripción y rubro.' },
  { icono: 'dividir', titulo: 'Dividí automáticamente', texto: 'RATIFY suma todo y lo reparte en partes iguales.' },
  { icono: 'balanza', titulo: 'Controlá quién debe', texto: 'Mirá el saldo de cada persona y las transferencias para quedar a mano.' },
  { icono: 'carpeta', titulo: 'Cerrá las cuentas', texto: 'Registrá los pagos y cerrá el grupo cuando nadie le deba a nadie.' },
]

function ComoFunciona() {
  return (
    <section className="como" aria-labelledby="como-titulo">
      <h2 id="como-titulo">Cómo funciona</h2>
      <ol className="pasos" role="list">
        {PASOS.map((p, i) => (
          <li key={p.titulo} className="paso">
            <span className="paso-marca" aria-hidden="true">
              <span className="paso-numero">{i + 1}</span>
              <Icono nombre={p.icono} size={22} />
            </span>
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
