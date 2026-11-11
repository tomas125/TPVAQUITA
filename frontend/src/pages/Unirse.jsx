import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { textoError } from '../api'

// Destino del QR y del mail de invitación
export default function Unirse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    api.post(`/grupos/${id}/unirse`)
      .then(() => navigate(`/grupos/${id}`))
      .catch((err) => setError(textoError(err)))
  }, [id])

  return error ? <p className="error">{error}</p> : <p className="centrado">Uniéndote al grupo…</p>
}
