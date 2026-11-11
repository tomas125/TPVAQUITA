import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api, { textoError } from '../api'

// El link del mail trae ?token=... → se canjea por el JWT
export default function Verificar() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    api.post('/auth/verificar', { token: params.get('token') })
      .then((res) => {
        localStorage.setItem('token', res.data.token) // queda logueado en este dispositivo
        const volver = localStorage.getItem('volver') ?? '/'
        localStorage.removeItem('volver')
        navigate(volver)
      })
      .catch((err) => setError(textoError(err)))
  }, [])

  return (
    <div className="auth">
      <div className="auth-tarjeta">
        {error ? <><p className="error">{error}</p><Link to="/login">Pedir otro link</Link></> : <p>Ingresando…</p>}
      </div>
    </div>
  )
}
