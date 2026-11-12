import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api, { textoError } from '../api'
import Icono from '../components/Iconos'
import Mascota from '../components/Mascota'
import { Aviso } from '../components/Estados'

export default function Invitar() {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const link = `${window.location.origin}/unirse/${id}` // mismo destino para el QR y el mail

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    setEnviando(true)
    try {
      await api.post(`/grupos/${id}/invitar`, { email })
      setMensaje(`Invitación enviada a ${email}`)
      setEmail('')
    } catch (err) {
      setError(textoError(err))
    } finally {
      setEnviando(false)
    }
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // sin permiso de portapapeles: el link igual queda visible para copiarlo a mano
    }
  }

  return (
    <div className="pagina-form pagina-form--ancha">
      <Link to={`/grupos/${id}`} className="volver"><Icono nombre="flechaIzq" size={18} /> Volver al grupo</Link>
      <div className="encabezado-form">
        <h1 className="form-titulo">Invitar al grupo</h1>
        <p className="form-bajada">Cada persona que se suma entra en la división de los gastos.</p>
      </div>

      <div className="invitar">
        <section className="entrada" aria-labelledby="qr-titulo">
          <Mascota asomado guino size={120} className="entrada-mascota" />
          <h2 id="qr-titulo">Escanea el QR para ingresar</h2>
          <div className="qr">
            <QRCodeSVG value={link} size={220} fgColor="#03045E" bgColor="#FFFFFF" marginSize={2}
              title="Código QR para unirse al grupo" />
          </div>
          {/* Talón troquelado de la "entrada" */}
          <div className="entrada-talon">
            <div className="enlace">
              <span className="enlace-texto">{link}</span>
              <button type="button" className="boton boton--fantasma boton--chico" onClick={copiar}>
                <Icono nombre={copiado ? 'check' : 'copiar'} size={16} />
                <span>{copiado ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="panel invitar-mail" aria-labelledby="mail-titulo">
          <h2 id="mail-titulo">Por mail</h2>
          <p className="panel-bajada">Le llega un link para sumarse. Solo el administrador puede invitar por mail.</p>
          <form className="formulario" onSubmit={enviar}>
            <div className="campo">
              <label htmlFor="invitar-email">Email de la persona</label>
              <input id="invitar-email" type="email" spellCheck={false} placeholder="email@ejemplo.com" autoComplete="off"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <Aviso>{error}</Aviso>}
            {mensaje && <Aviso tipo="exito">{mensaje}</Aviso>}
            <button className="boton boton--primario" disabled={enviando}>
              {enviando ? <span className="girando" aria-hidden="true" /> : <Icono nombre="mail" />}
              <span>{enviando ? 'Enviando…' : 'Enviar invitación'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
