import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api, { textoError } from '../api'

export default function Invitar() {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const link = `${window.location.origin}/unirse/${id}` // mismo destino para el QR y el mail

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      await api.post(`/grupos/${id}/invitar`, { email })
      setMensaje(`Invitación enviada a ${email}`)
      setEmail('')
    } catch (err) {
      setError(textoError(err))
    }
  }

  return (
    <div className="angosta">
      <h2>Invitar al grupo</h2>
      <p>Escaneá este QR para unirte:</p>
      <div className="qr"><QRCodeSVG value={link} size={220} /></div>
      <p className="tenue">{link}</p>

      <form className="formulario" onSubmit={enviar}>
        <label>O invitá por mail</label>
        <input type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="exito">{mensaje}</p>}
        <button className="boton">Enviar invitación</button>
      </form>
    </div>
  )
}
