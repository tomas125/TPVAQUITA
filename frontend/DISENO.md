# RATIFY · Sistema visual

## Concepto: "la libreta del contador pícaro"

RATIFY es una rata contadora que anota todo y no deja pasar un peso. El lenguaje gráfico sale de
los objetos de esa escena, no de un kit de dashboard:

- **El ticket.** Todo lo que es plata se imprime en papel de ticket: borde dentado, líneas
  punteadas entre concepto e importe, cifras en monoespaciada tabular. Es el elemento que identifica
  a RATIFY sin leer el nombre.
- **El sello "RATIFICADO".** Cuando algo queda confirmado (cuentas saldadas, gasto guardado, pago
  registrado) aparece un sello de goma que golpea la pantalla. Es el único momento "fuerte" de
  movimiento de la app; el resto es sobrio.
- **El signo igual.** Dividir en partes iguales: el `=` vive en el isotipo (la moneda-cabeza de
  ratón) y aparece como separador y viñeta.
- **Papel cuadriculado de libro contable** como textura, solo sobre superficies oscuras de marca.

## Mascota: Rati

Rata contadora con anteojos redondos y visera verde-agua de contador. Un solo dibujo vectorial con
expresiones (`feliz`, `guino`, `pensando`, `sorpresa`) y accesorios (`moneda`, `calculadora`,
`sello`, `cartel`, `lupa`). Cada pantalla la usa en una situación distinta:

| Pantalla | Situación |
|---|---|
| Ingreso / registro | Asomada desde el borde del panel, con la moneda (registro: calculadora) |
| Inicio | Sentada sobre la pila de monedas del banner |
| Sin grupos | Guiñando, con lupa: "acá no hay nada que revisar" |
| Nuevo grupo | Sostiene un cartel con el nombre que se escribe |
| Nuevo gasto | Asomada sobre el visor del importe |
| Saldos sin deudas | Con el sello, guiñando |
| Esperas | Pensando con la calculadora (parpadea y mueve la cola) |

## Color: roles, no decoración

| Token | Hex | Uso |
|---|---|---|
| `--tinta` (Deep Twilight) | #03045E | Texto, superficies de marca oscuras, sello |
| `--marca` (Bright Teal Blue) | #0077B6 | Acción principal, links, foco |
| `--surf` (Turquoise Surf) | #00B4D8 | Acento solo sobre oscuro (nunca texto sobre blanco) |
| `--escarcha` (Frosted Blue) | #90E0EF | Líneas y rellenos sobre oscuro, detalles de la mascota |
| `--cian` (Light Cyan) | #CAF0F8 | Fondo de la app (aclarado), piel de Rati |
| `--rojo` | #DA2C38 | Solo deudas y acciones destructivas (texto: #B81F2A) |
| `--verde` | #87C38F | Solo saldo a favor / saldado (texto: #2E6B36) |

Rojo y verde nunca son decorativos: si aparecen, hay plata en juego. Siempre van acompañados de
texto ("Debe", "A favor"), nunca el color solo.

## Tipografía

- **Bricolage Grotesque** (titulares): grotesca con remates irregulares, tiene la picardía de la
  marca sin caer en tipografía infantil.
- **Onest** (interfaz y texto): neutra, muy legible, números claros.
- **IBM Plex Mono** (solo dentro de tickets e importes impresos): la voz de la ticketera.

## Forma y profundidad

- Radios por jerarquía: 6px controles chicos, 12px campos y botones, 20px superficies grandes; el
  papel del ticket no tiene radio (es papel).
- Sombras ambientales teñidas de azul tinta, nunca gris neutro; una sola elevación por pantalla.
- Vidrio esmerilado solo en el encabezado fijo (necesita ver el contenido que pasa por debajo).

## Movimiento

- Entrada de pantalla: 260ms, fundido + 8px.
- El ticket se "imprime" (revela de arriba hacia abajo) al abrir un grupo.
- Sello RATIFICADO: golpe con rebote, 450ms.
- Rati: parpadeo y cola en reposo, cada varios segundos.
- Botones: elevación en hover, hundido al presionar, 150ms.
- `prefers-reduced-motion`: todo queda quieto y visible.
