import Logo from './Logo'
import Mascota from './Mascota'

// Marco de las pantallas sin sesión: panel de marca (papel contable oscuro) + formulario
export default function AuthMarco({ children, expresion = 'feliz' }) {
  return (
    <div className="auth">
      <aside className="auth-marca">
        <Logo claro size={40} />

        {/* Tira de ticket ilustrativa: líneas sin datos, solo forma */}
        <div className="auth-ticket" aria-hidden="true">
          <span className="auth-ticket-linea" style={{ '--l': '70%' }} />
          <span className="auth-ticket-linea" style={{ '--l': '48%' }} />
          <span className="auth-ticket-linea" style={{ '--l': '84%' }} />
          <span className="auth-ticket-linea" style={{ '--l': '60%' }} />
          <span className="auth-ticket-igual">=</span>
        </div>

        <p className="auth-frase">
          <span>Ni un peso más,</span>
          <span>ni un peso menos.</span>
        </p>
        <p className="auth-bajada">Las cuentas claras del grupo, sin planillas ni discusiones.</p>
      </aside>

      <main className="auth-contenido">
        <div className="auth-columna">
          {/* Rati se asoma por el borde del formulario */}
          <Mascota asomado expresion={expresion} size={150} className="auth-mascota mascota--viva" />
          <div className="auth-papel">{children}</div>
        </div>
      </main>
    </div>
  )
}
