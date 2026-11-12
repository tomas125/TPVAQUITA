import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { textoError } from '../api'
import { Aviso, Espera } from '../components/Estados'

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

  return (
    <section className="pagina-centro">
      {error ? (
        <div className="panel panel--angosto">
          <h1 className="form-titulo">No pudiste unirte al grupo</h1>
          <Aviso>{error}</Aviso>
          <Link to="/" className="boton boton--secundario">Ir a mis grupos</Link>
        </div>
      ) : (
        <>
          <h1 className="sr-only">Uniéndote al grupo</h1>
          <Espera texto="Uniéndote al grupo…" />
        </>
      )}
    </section>
  )
}
