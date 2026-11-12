import { useEffect, useRef, useState } from 'react'
import Mascota from './Mascota'
import Icono from './Iconos'

// Bloques "esqueleto" mientras llegan los datos
export function Esqueleto({ filas = 3 }) {
  return (
    <div className="esqueleto" role="status" aria-live="polite">
      <span className="sr-only">Cargando…</span>
      <div className="esqueleto-bloque esqueleto-bloque--titulo" />
      {Array.from({ length: filas }, (_, i) => <div key={i} className="esqueleto-bloque" />)}
    </div>
  )
}

// Pantalla de espera con la mascota (ingreso, unirse a un grupo)
export function Espera({ texto }) {
  return (
    <div className="espera" role="status" aria-live="polite">
      <Mascota accesorio="calculadora" expresion="pensando" size={150} className="mascota--viva" />
      <p className="espera-texto">
        {texto}
        <span className="puntos" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
      </p>
    </div>
  )
}

export function Aviso({ tipo = 'error', children }) {
  return (
    <p className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icono nombre={tipo === 'error' ? 'alerta' : 'check'} size={18} />
      <span>{children}</span>
    </p>
  )
}

// El sello de goma de la marca: golpea al aparecer
export function Sello({ texto = 'Ratificado', chico = false }) {
  return (
    <span className={`sello ${chico ? 'sello--chico' : ''}`} aria-hidden="true">
      <span className="sello-texto">{texto}</span>
    </span>
  )
}

// Confirmación flotante con sello (gasto guardado, pago registrado...). Se va sola.
export function Confirmacion({ mensaje, onFin, duracion = 3200 }) {
  const [saliendo, setSaliendo] = useState(false)
  // Ref para que un onFin nuevo en cada render no reinicie los temporizadores
  const fin = useRef(onFin)
  useEffect(() => { fin.current = onFin })

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), duracion)
    const t2 = setTimeout(() => fin.current?.(), duracion + 300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [duracion])

  return (
    <div className={`confirmacion ${saliendo ? 'confirmacion--saliendo' : ''}`} role="status" aria-live="polite">
      <Sello chico />
      <span className="confirmacion-texto">{mensaje}</span>
    </div>
  )
}
