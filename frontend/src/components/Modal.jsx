import { useEffect, useRef } from 'react'

// Modal sobre <dialog> nativo: trae foco atrapado, cierre con Esc y fondo bloqueado sin JS extra
export default function Modal({ abierto, onCerrar, titulo, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierto && !dialogo.open) dialogo.showModal()
    if (!abierto && dialogo.open) dialogo.close()
  }, [abierto])

  // Click en el fondo (fuera de la caja) cierra
  const clickFondo = (e) => {
    if (e.target === ref.current) onCerrar()
  }

  return (
    <dialog ref={ref} className="modal" onCancel={(e) => { e.preventDefault(); onCerrar() }} onClick={clickFondo}
      aria-labelledby="modal-titulo">
      {abierto && (
        <div className="modal-caja">
          <h2 id="modal-titulo" className="modal-titulo">{titulo}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
