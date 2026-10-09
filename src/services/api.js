const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      // noop: respuesta sin JSON
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchLeaderboard() {
  return request(`${API_BASE_URL}/leaderboard?_sort=score&_order=desc&_limit=10`);
}

export async function saveLeaderboardEntry(entry) {
  return request(`${API_BASE_URL}/leaderboard`, {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function sendResultToWebhook(payload) {
  if (!N8N_WEBHOOK_URL) {
    return { skipped: true };
  }

  return request(N8N_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getApiConfig() {
  return {
    apiBaseUrl: API_BASE_URL,
    webhookUrl: N8N_WEBHOOK_URL,
  };
}
