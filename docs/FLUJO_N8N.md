# Flujo n8n — Sakura 21

## Objetivo

Registrar el resultado final de una partida de Sakura 21 desde el frontend.

## Entrada

El frontend envía un `POST` al webhook con:

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

## Flujo

1. **Webhook** recibe el resultado.
2. **Validate Result** limpia y valida los datos.
3. **Switch Outcome** clasifica el tipo de resultado.
4. Un nodo **Set** prepara un mensaje según el resultado.
5. **POST Game Log** guarda la partida en `json-server` usando `/gameLogs`.
6. **Respond to Webhook** responde al frontend con un JSON de confirmación.

## URL esperada

```text
http://localhost:5678/webhook/sakura21-result
```

## Acción final útil

El flujo escribe un registro en:

```text
http://localhost:3001/gameLogs
```

Eso permite tener un historial independiente del webhook además del leaderboard principal.
