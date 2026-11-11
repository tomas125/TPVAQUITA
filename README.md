# 🐮 Vaquita

App de gastos compartidos. TP Final · UTN FRSN · Programación IV.

- **Backend:** ASP.NET Core 8 Web API + EF Core 8 + SQL Server (`backend/`)
- **Frontend:** React + Vite (`frontend/`)
- **Login:** sin contraseña, con *magic link* por mail (JWT de 60 días guardado en el dispositivo).

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (LocalDB, Express o instancia local)
- [Node.js](https://nodejs.org/) 18 o superior
- Herramienta de migraciones: `dotnet tool install --global dotnet-ef`

## Cómo levantar todo

### 1. Backend

```bash
cd backend
dotnet ef database update     # crea la base VaquitaDb y aplica las migraciones
dotnet run                    # API en http://localhost:5054 (Swagger en /swagger)
```

La conexión está en `backend/appsettings.json` (`ConnectionStrings:DefaultConnection`,
por defecto `Server=localhost;Database=VaquitaDb;Trusted_Connection=True`). Ajustala si tu SQL Server es otro.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

El front usa `http://localhost:5054/api` por defecto. Para cambiarlo, copiá `env.example` como `.env`
y editá `VITE_API_URL`.

> El puerto **5173 es fijo**: el CORS del backend solo acepta ese origen, y `FrontendUrl`
> (links de los mails) apunta ahí.

## Configuración del mail

Los datos del mail van en `backend/appsettings.Local.json` (está en `.gitignore`, **no se sube a GitHub**):

```json
{
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "User": "tucuenta@gmail.com",
    "Password": "contraseña de aplicación de 16 letras, sin espacios",
    "From": "tucuenta@gmail.com"
  }
}
```

- La contraseña de aplicación se genera en <https://myaccount.google.com/apppasswords> (requiere verificación en dos pasos).
- El mail le llega a **cualquier** usuario registrado; la cuenta configurada es solo el remitente.
- El link de ingreso es de **un solo uso** y vence en **1 hora**.

**Modo desarrollo:** si no hay `Host` o `Password`, el backend no envía el mail: lo muestra en la consola
y el front muestra un botón **"Ingresar (modo desarrollo)"**. No copies el link de la consola con Ctrl+C
(apaga el backend): usá Ctrl+click o el botón del front.

## Prueba de punta a punta

Con los datos del enunciado: **Pedro 105.000 · Mario 32.400 · José 81.000 · Julio 15.000**
→ total 233.400, cuota **58.350** por persona.

El orden de ingreso al grupo importa para el Cuadro 2: Pedro (crea el grupo), Mario, José y Julio.

1. **Registrar 4 usuarios** en `/registro` (Pedro, Mario, José, Julio; apodos distintos). Cada registro
   manda un link: tomalo de la consola del backend y abrilo para ingresar.
   *Tip: usá un navegador (o ventana privada) distinto por usuario, la sesión se guarda en `localStorage`.*
2. **Pedro** crea el grupo en `/grupos/nuevo` (ej. "Asado").
3. **Pedro** va a *Invitar*. Los otros tres entran al link `http://localhost:5173/unirse/{id}` (el que muestra
   el QR) en este orden: Mario, José, Julio. Si no tienen sesión, ingresan y vuelven solos al grupo.
   También se puede probar la invitación por mail (solo la ve el admin): llega el link a la consola.
4. **Cargar los gastos** con *Nuevo gasto*, eligiendo el pagador de cada uno:
   Pedro 105.000, Mario 32.400, José 81.000, Julio 15.000.
5. En **Saldos** debería verse:

   | Persona | Total gastos | Saldo |
   |---|---:|---:|
   | Pedro | $ 105.000,00 | $ 46.650,00 |
   | Mario | $ 32.400,00 | −$ 25.950,00 |
   | José | $ 81.000,00 | $ 22.650,00 |
   | Julio | $ 15.000,00 | −$ 43.350,00 |
   | **Total** | **$ 233.400,00** | **$ 58.350,00 c/u** |

   Cuadro 2: `Mario > Pedro 25.950` · `Julio > Pedro 20.700` · `Julio > José 22.650`.
6. **Julio le paga 20.700 a Pedro**: *Registrar pago* en `Julio > Pedro`. Aparece en el historial y
   la deuda de Julio con Pedro desaparece.
7. **Saldar el resto**: `Mario > Pedro 25.950` y `Julio > José 22.650` (se puede probar un pago parcial
   editando el importe del modal y completar después).
8. Con todos los saldos en cero, **Cerrar grupo** se habilita. Al cerrarlo desaparece del desplegable
   y ya no admite gastos ni pagos.

## Endpoints principales

| Método | Ruta | Notas |
|---|---|---|
| POST | `api/auth/registro`, `api/auth/login`, `api/auth/verificar` | Públicos |
| GET | `api/usuarios/me` | Usuario logueado + `ultimoGrupoId` |
| POST / GET | `api/grupos`, `api/grupos?soloActivos=` | Crear / mis grupos |
| GET | `api/grupos/{id}` | Incluye `adminId`; guarda el último grupo usado |
| POST | `api/grupos/{id}/unirse` | Destino del QR y del mail |
| POST | `api/grupos/{id}/invitar` | Solo admin (403 si no); manda mail con `{FrontendUrl}/unirse/{id}` |
| GET / POST | `api/grupos/{id}/gastos` | Solo integrantes |
| GET | `api/grupos/{id}/saldos`, `api/grupos/{id}/pagos` | Cuadro 1, Cuadro 2 e historial |
| POST | `api/grupos/{id}/pagos`, `api/grupos/{id}/cerrar` | Registrar pago / cerrar grupo |
