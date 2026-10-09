# Sakura 21

Juego de cartas **21 / Blackjack** desarrollado con **React + Vite** y una identidad visual **japonesa oriental**. El proyecto cumple con componentes reutilizables, manejo de estado con hooks, rutas con React Router, consumo de datos mediante `json-server` y una integración preparada para **n8n**.

---

## Características principales

- Juego funcional de **21**: pedir carta, plantarse, dealer automático y resolución completa de la ronda.
- Cartas con diseño **oriental japonés** creado completamente con CSS.
- **3 rutas principales** + **1 ruta dinámica**:
  - `/`
  - `/play`
  - `/scores`
  - `/round/:id`
- Persistencia local del historial reciente con `localStorage`.
- **GET** y **POST** reales contra `json-server`:
  - `GET /leaderboard`
  - `POST /leaderboard`
- Soporte opcional para enviar el resultado final a un **webhook de n8n**.
- Manejo de estados de carga y error en la interfaz.

---

## Tecnologías

- React 18
- Vite
- React Router DOM
- JSON Server
- CSS moderno
- n8n (workflow incluido en carpeta `/n8n`)

---

## Hooks utilizados

- `useState`: controla nombre del jugador, manos, deck, estado de la ronda y sincronización.
- `useEffect`: arranque de la ronda, redirección si no hay jugador, carga del leaderboard y detección de fin de ronda.
- `useMemo`: calcula totales de manos y valores derivados evitando recomputaciones innecesarias.
- `useRef`: evita dobles ejecuciones al finalizar la ronda y da foco al input del jugador.
- `useContext`: comparte el jugador y el historial local entre páginas.

---

## Estructura del proyecto

```text
sakura21/
├── public/
├── src/
│   ├── components/
│   │   ├── game/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
├── n8n/
├── db.json
├── .env.example
├── package.json
└── README.md
```

---

## Cómo ejecutar

### 1) Instalar dependencias

```bash
npm install
```

### 2) Levantar la API local con JSON Server

```bash
npm run api
```

Esto expone por defecto:

```text
http://localhost:3001/leaderboard
http://localhost:3001/gameLogs
```

### 3) Iniciar la app React

En otra terminal:

```bash
npm run dev
```

Abre:

```text
http://localhost:5173
```

---

## Variables de entorno

Copia `.env.example` a `.env` si quieres personalizar la integración.

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/sakura21-result
```

- `VITE_API_BASE_URL`: URL base de `json-server`.
- `VITE_N8N_WEBHOOK_URL`: URL del webhook de n8n. Si no existe, el juego sigue funcionando sin error.

---

## Rutas

- `/` → Pantalla de inicio y entrada del jugador.
- `/play` → Mesa de juego de Sakura 21.
- `/scores` → Leaderboard remoto + historial local.
- `/round/:id` → Resumen dinámico de una ronda finalizada.

---

## API utilizada

### Lectura (GET)

```http
GET /leaderboard
```

Se consume para mostrar el top de puntajes.

### Escritura (POST)

```http
POST /leaderboard
```

Se ejecuta al terminar cada partida para guardar el resultado.

Ejemplo de payload:

```json
{
  "player": "Bernny",
  "score": 121,
  "outcome": "BLACKJACK",
  "playerTotal": 21,
  "dealerTotal": 18,
  "roundId": "round-1726649250",
  "createdAt": "2026-09-21T15:14:00.000Z"
}
```

---

## Lógica del juego

1. Se crea un mazo de 52 cartas.
2. Se baraja y se reparten dos cartas al jugador y dos al dealer.
3. El jugador puede:
   - **Pedir carta**
   - **Plantarse**
4. El dealer roba automáticamente hasta llegar a **17 o más**.
5. Se determina el resultado:
   - `BLACKJACK`
   - `WIN`
   - `PUSH`
   - `LOSE`
   - `BUST`
6. Se guarda el resultado en el leaderboard y opcionalmente se envía al webhook de n8n.

---

## n8n

En la carpeta `/n8n` se incluye un workflow exportado listo para importar:

```text
n8n/sakura21_score_webhook.json
```

### URL esperada del webhook

```text
http://localhost:5678/webhook/sakura21-result
```

### Qué hace el workflow

- Recibe el puntaje final del jugador.
- Valida datos básicos.
- Clasifica el resultado con un `Switch`.
- Registra el resultado en `gameLogs` de `json-server`.
- Responde al frontend con un mensaje.

---

## Revisión funcional realizada

Antes de entregar se revisó:

- estructura modular por componentes;
- flujo completo de juego;
- ruta dinámica `/round/:id`;
- consumo de datos GET/POST;
- manejo de errores si `json-server` no está activo;
- sincronización opcional con n8n;
- persistencia de historial local;
- consistencia visual de cartas y layout.

---

## Nota importante

Si `json-server` o el webhook de n8n no están activos, la app **sigue siendo jugable**. En ese caso:

- el historial local sigue funcionando;
- el leaderboard remoto mostrará error controlado;
- guardar la puntuación se intentará, y si falla, la partida seguirá guardada localmente.

---

## Autoría sugerida para entrega

Puedes usar este proyecto como base de tu repositorio y luego hacer commits progresivos para cumplir con la rúbrica del quiz.
