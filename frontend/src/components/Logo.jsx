// Isotipo: cabeza de ratón formada por una moneda con un "=" (dividir en partes iguales)
export function Isotipo({ size = 40, className = '' }) {
  return (
    <svg className={`isotipo ${className}`} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill="#03045E" />
      <circle cx="19" cy="22" r="9" fill="#90E0EF" />
      <circle cx="45" cy="22" r="9" fill="#90E0EF" />
      <circle cx="32" cy="36" r="17" fill="#00B4D8" />
      <circle cx="32" cy="36" r="12.5" fill="none" stroke="#03045E" strokeWidth="2" opacity=".35" />
      <rect x="24" y="31" width="16" height="3.5" rx="1.75" fill="#03045E" />
      <rect x="24" y="38" width="16" height="3.5" rx="1.75" fill="#03045E" />
    </svg>
  )
}

// Logo completo: isotipo + nombre (+ eslogan opcional)
export default function Logo({ conEslogan = false, claro = false, size = 40 }) {
  return (
    <span className={`logo ${claro ? 'logo--claro' : ''}`}>
      <Isotipo size={size} />
      <span className="logo-textos">
        <span className="logo-nombre" translate="no">RATIFY</span>
        {conEslogan && <span className="logo-eslogan">Ni un peso más, ni un peso menos</span>}
      </span>
    </span>
  )
}
