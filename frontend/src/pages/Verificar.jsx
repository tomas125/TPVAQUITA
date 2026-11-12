import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api, { textoError } from '../api'
import AuthMarco from '../components/AuthMarco'
import { Aviso, Espera } from '../components/Estados'

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
    <AuthMarco expresion="pensando">
      <div className="formulario auth-form">
        {error ? (
          <>
            <h1 className="form-titulo">No pudimos ingresarte</h1>
            <Aviso>{error}</Aviso>
            <p className="form-bajada">El link es de un solo uso y vence en una hora.</p>
            <Link to="/login" className="boton boton--primario boton--grande">Pedir otro link</Link>
          </>
        ) : (
          <>
            <h1 className="sr-only">Ingresando</h1>
            <Espera texto="Revisando tu link…" />
          </>
        )}
      </div>
    </AuthMarco>
  )
}
