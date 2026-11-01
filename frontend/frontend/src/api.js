// Single place where the API base URL is configured.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(API_BASE_URL + path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Can't reach the server at ${API_BASE_URL}. Check that the backend is running.`);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const detail = typeof data === 'string' ? data : data?.message || data?.error || '';
    throw new Error(detail ? `${detail} (HTTP ${res.status})` : `The server rejected the request (HTTP ${res.status}).`);
  }
  return data;
}

const resource = (base) => ({
  list: async () => {
    const data = await request(base);
    return Array.isArray(data) ? data : [];
  },
  get: (id) => request(`${base}/${id}`),
  create: (body) => request(base, { method: 'POST', body }),
  update: (id, body) => request(`${base}/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`${base}/${id}`, { method: 'DELETE' }),
});

export const usersApi = resource('/user');
export const categoriesApi = resource('/category');
export const expensesApi = resource('/expense');
