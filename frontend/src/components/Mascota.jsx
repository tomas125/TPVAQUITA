// "Rati", la rata contadora de RATIFY. Un solo dibujo con expresiones y accesorios
// intercambiables, para que sea el mismo personaje en todas las pantallas.
// accesorio: 'moneda' | 'calculadora' | 'sello' | 'cartel' | 'lupa' | 'nada'
// expresion: 'feliz' | 'guino' | 'pensando' | 'sorpresa'
// asomado: solo cabeza y patitas, para asomarse por el borde de un bloque
// titulo: si viene, se anuncia a lectores de pantalla; si no, es decorativa

const T = '#03045E' // trazo (Deep Twilight)
const PIEL = '#CAF0F8'
const DETALLE = '#90E0EF'
const ACENTO = '#00B4D8'
const BLANCO = '#FFFFFF'

function Manos({ izq = [86, 188], der = [134, 188] }) {
  return (
    <>
      <ellipse cx={izq[0]} cy={izq[1]} rx="10" ry="8" fill={PIEL} stroke={T} strokeWidth="4" />
      <ellipse cx={der[0]} cy={der[1]} rx="10" ry="8" fill={PIEL} stroke={T} strokeWidth="4" />
    </>
  )
}

function Moneda() {
  return (
    <g className="mascota-accesorio">
      <circle cx="110" cy="182" r="24" fill={ACENTO} stroke={T} strokeWidth="4" />
      <circle cx="110" cy="182" r="16" fill="none" stroke={T} strokeWidth="2" opacity=".35" />
      <rect x="101" y="175" width="18" height="4" rx="2" fill={T} />
      <rect x="101" y="185" width="18" height="4" rx="2" fill={T} />
      <Manos />
    </g>
  )
}

function Calculadora() {
  const teclas = []
  for (let f = 0; f < 3; f++)
    for (let c = 0; c < 3; c++)
      teclas.push(
        <rect key={`${f}-${c}`} x={96 + c * 10} y={176 + f * 9} width="7" height="6" rx="1.5"
          fill={f === 2 && c === 2 ? ACENTO : DETALLE} />,
      )
  return (
    <g className="mascota-accesorio">
      <rect x="88" y="154" width="44" height="54" rx="8" fill={T} />
      <rect x="94" y="160" width="32" height="11" rx="3" fill={DETALLE} />
      <rect x="110" y="163" width="12" height="5" rx="1" fill={T} opacity=".55" />
      {teclas}
      <Manos izq={[86, 192]} der={[134, 192]} />
    </g>
  )
}

function Sello() {
  return (
    <g className="mascota-accesorio mascota-sello">
      <circle cx="110" cy="156" r="11" fill={T} />
      <rect x="104" y="162" width="12" height="16" fill={T} />
      <rect x="82" y="176" width="56" height="16" rx="4" fill={ACENTO} stroke={T} strokeWidth="4" />
      <rect x="86" y="192" width="48" height="7" rx="2" fill={T} />
      <Manos izq={[84, 184]} der={[136, 184]} />
    </g>
  )
}

function Cartel({ texto }) {
  const limpio = (texto || 'Mi grupo').trim()
  // Achica la letra según el largo para que el nombre entre en el cartel
  const tam = Math.max(10, Math.min(22, 220 / Math.max(limpio.length, 1)))
  return (
    <g className="mascota-accesorio">
      <rect x="28" y="146" width="164" height="60" rx="8" fill={BLANCO} stroke={T} strokeWidth="4" />
      <rect x="36" y="154" width="148" height="44" rx="4" fill="none" stroke={DETALLE} strokeWidth="2" strokeDasharray="5 4" />
      <text x="110" y="176" textAnchor="middle" dominantBaseline="central" fill={T}
        fontFamily="'Bricolage Grotesque', sans-serif" fontWeight="800" fontSize={tam}>
        {limpio.length > 26 ? `${limpio.slice(0, 25)}…` : limpio}
      </text>
      <Manos izq={[30, 176]} der={[190, 176]} />
    </g>
  )
}

function Lupa() {
  return (
    <g className="mascota-accesorio">
      <path d="M142 194 L 164 218" stroke={T} strokeWidth="9" strokeLinecap="round" />
      <circle cx="128" cy="178" r="20" fill={BLANCO} fillOpacity=".55" stroke={T} strokeWidth="5" />
      <path d="M118 170 Q122 164 130 164" fill="none" stroke={BLANCO} strokeWidth="3" strokeLinecap="round" />
      <Manos izq={[90, 190]} der={[150, 200]} />
    </g>
  )
}

const ACCESORIOS = { moneda: Moneda, calculadora: Calculadora, sello: Sello, lupa: Lupa }

// Ojos y boca según la expresión
function Cara({ expresion }) {
  const ojo = (cx, cy, r = 5.5) => (
    <>
      <circle cx={cx} cy={cy} r={r} fill={T} />
      <circle cx={cx + 2} cy={cy - 2} r="1.7" fill={BLANCO} />
    </>
  )

  let ojos
  let boca
  if (expresion === 'guino') {
    ojos = <>
      <path d="M82 107 Q90 100 98 107" fill="none" stroke={T} strokeWidth="3.5" strokeLinecap="round" />
      {ojo(130, 106)}
    </>
    boca = <path d="M99 133 Q112 142 122 130" fill="none" stroke={T} strokeWidth="3" strokeLinecap="round" />
  } else if (expresion === 'pensando') {
    ojos = <>{ojo(93, 103)}{ojo(133, 103)}</>
    boca = <path d="M102 136 Q111 132 120 135" fill="none" stroke={T} strokeWidth="3" strokeLinecap="round" />
  } else if (expresion === 'sorpresa') {
    ojos = <>{ojo(90, 106, 6.5)}{ojo(130, 106, 6.5)}</>
    boca = <ellipse cx="110" cy="137" rx="5" ry="6" fill={T} />
  } else {
    ojos = <>{ojo(90, 106)}{ojo(130, 106)}</>
    boca = <path d="M100 132 Q110 140 120 132" fill="none" stroke={T} strokeWidth="3" strokeLinecap="round" />
  }

  return (
    <>
      <g className="mascota-ojos">{ojos}</g>
      {boca}
      {expresion !== 'sorpresa' && (
        <>
          <rect x="105.5" y="136" width="9" height="8" rx="2" fill={BLANCO} stroke={T} strokeWidth="2" />
          <path d="M110 136 V144" stroke={T} strokeWidth="1.5" />
        </>
      )}
      {expresion === 'pensando' && (
        <path d="M120 86 Q131 80 142 85" fill="none" stroke={T} strokeWidth="3.5" strokeLinecap="round" />
      )}
    </>
  )
}

function Cabeza({ expresion }) {
  return (
    <>
      {/* Orejas */}
      <g className="mascota-oreja mascota-oreja--izq">
        <circle cx="60" cy="62" r="30" fill={PIEL} stroke={T} strokeWidth="5" />
        <circle cx="60" cy="62" r="18" fill={DETALLE} />
      </g>
      <g className="mascota-oreja mascota-oreja--der">
        <circle cx="160" cy="62" r="30" fill={PIEL} stroke={T} strokeWidth="5" />
        <circle cx="160" cy="62" r="18" fill={DETALLE} />
      </g>

      <circle cx="110" cy="104" r="50" fill={PIEL} stroke={T} strokeWidth="5" />

      {/* Visera de contador: vincha + ala translúcida */}
      <path d="M63 86 C 74 58, 146 58, 157 86 L 149 92 C 137 74, 83 74, 71 92 Z"
        fill={ACENTO} stroke={T} strokeWidth="4" strokeLinejoin="round" />
      <path d="M80 80 C 96 70, 124 70, 140 80" fill="none" stroke={BLANCO} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <path d="M74 88 C 90 80, 130 80, 146 88 C 136 96, 84 96, 74 88 Z"
        fill={ACENTO} fillOpacity=".45" stroke={T} strokeWidth="3" strokeLinejoin="round" />

      <ellipse cx="74" cy="126" rx="8" ry="4.5" fill={DETALLE} />
      <ellipse cx="146" cy="126" rx="8" ry="4.5" fill={DETALLE} />
      <ellipse cx="110" cy="130" rx="24" ry="16" fill={BLANCO} />

      <g stroke={T} strokeWidth="2.5" strokeLinecap="round" opacity=".55">
        <path d="M86 126 L 56 119" />
        <path d="M86 133 L 55 137" />
        <path d="M134 126 L 164 119" />
        <path d="M134 133 L 165 137" />
      </g>

      <ellipse cx="110" cy="120" rx="8" ry="6" fill={T} />

      <Cara expresion={expresion} />

      {/* Anteojos */}
      <g fill={BLANCO} fillOpacity=".15" stroke={T} strokeWidth="4">
        <circle cx="90" cy="105" r="16" />
        <circle cx="130" cy="105" r="16" />
      </g>
      <path d="M106 102 Q110 97 114 102" fill="none" stroke={T} strokeWidth="4" strokeLinecap="round" />
      <path d="M74 102 L 64 98" stroke={T} strokeWidth="4" strokeLinecap="round" />
      <path d="M146 102 L 156 98" stroke={T} strokeWidth="4" strokeLinecap="round" />
    </>
  )
}

export default function Mascota({
  accesorio = 'moneda', expresion = 'feliz', guino = false, asomado = false, cartel = '',
  titulo, className = '', size = 220,
}) {
  const decorativa = !titulo
  const cara = guino ? 'guino' : expresion
  const Accesorio = ACCESORIOS[accesorio]
  // Asomado: se recorta a la cabeza y se agregan las patitas agarradas del borde
  const caja = asomado ? [0, 28, 220, 136] : [0, 0, 220, 240]

  return (
    <svg
      className={`mascota ${asomado ? 'mascota--asomada' : ''} ${className}`}
      width={size}
      height={size * (caja[3] / caja[2])}
      viewBox={caja.join(' ')}
      role={decorativa ? undefined : 'img'}
      aria-hidden={decorativa ? 'true' : undefined}
      aria-label={titulo}
      focusable="false"
    >
      {asomado ? (
        <>
          <Cabeza expresion={cara} />
          <ellipse cx="78" cy="156" rx="13" ry="9" fill={PIEL} stroke={T} strokeWidth="4" />
          <ellipse cx="142" cy="156" rx="13" ry="9" fill={PIEL} stroke={T} strokeWidth="4" />
        </>
      ) : (
        <>
          <ellipse cx="110" cy="232" rx="62" ry="7" fill={T} opacity=".12" />
          <path className="mascota-cola" d="M152 208 C 198 216, 216 178, 198 158 C 186 144, 196 126, 212 130"
            fill="none" stroke={T} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="110" cy="178" rx="52" ry="52" fill={PIEL} stroke={T} strokeWidth="5" />
          <ellipse cx="110" cy="190" rx="32" ry="32" fill={BLANCO} />
          <ellipse cx="84" cy="228" rx="17" ry="8" fill={DETALLE} stroke={T} strokeWidth="4" />
          <ellipse cx="136" cy="228" rx="17" ry="8" fill={DETALLE} stroke={T} strokeWidth="4" />
          <Cabeza expresion={cara} />
          {accesorio === 'cartel' ? <Cartel texto={cartel} /> : Accesorio ? <Accesorio /> : <Manos />}
        </>
      )}
    </svg>
  )
}
