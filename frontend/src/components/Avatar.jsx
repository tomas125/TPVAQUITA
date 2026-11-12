// Avatar con iniciales. El color sale del id para que cada persona mantenga el suyo en toda la app.
const TONOS = ['tono-1', 'tono-2', 'tono-3', 'tono-4']

const iniciales =(texto = '') =>
  texto.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'

export function Avatar({ id = 0, texto, size = 'md' }) {
  return (
    <span className={`avatar avatar--${size} ${TONOS[Math.abs(id) % TONOS.length]}`} aria-hidden="true">
      {iniciales(texto)}
    </span>
  )
}

// Pila de avatares superpuestos; el resto se resume en "+n"
export function PilaAvatares({ personas, max = 4, size = 'sm' }) {
  const visibles = personas.slice(0, max)
  const resto = personas.length - visibles.length
  return (
    <span className="pila-avatares">
      {visibles.map((p) => <Avatar key={p.id} id={p.id} texto={p.apodo} size={size} />)}
      {resto > 0 && <span className={`avatar avatar--${size} avatar--resto`} aria-hidden="true">+{resto}</span>}
    </span>
  )
}
