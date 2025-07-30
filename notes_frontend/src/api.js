//
// PUBLIC_INTERFACE
// Utilities for all REST API calls to 'notes_database' backend.
// Reads API endpoint (and others) from environment variables.
//
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper: fetch with authentication, error handling, JSON
async function apiRequest(path, { method = 'GET', data, token, headers = {}, params } = {}) {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const opts = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    opts.body = JSON.stringify(data);
  }

  const resp = await fetch(url, opts);
  if (resp.status === 401) throw new Error('Unauthorized');
  if (!resp.ok) {
    let message;
    try {
      const errorJson = await resp.json();
      message = errorJson.message || JSON.stringify(errorJson);
    } catch {
      message = resp.statusText;
    }
    throw new Error(`API error: ${message}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  return apiRequest('/auth/login', { method: 'POST', data: { email, password } });
}

// PUBLIC_INTERFACE
export async function register({ email, password }) {
  return apiRequest('/auth/register', { method: 'POST', data: { email, password } });
}

// PUBLIC_INTERFACE
export async function logout({ token }) {
  return apiRequest('/auth/logout', { method: 'POST', token });
}

// PUBLIC_INTERFACE
export async function getMe({ token }) {
  return apiRequest('/auth/me', { token });
}

// PUBLIC_INTERFACE
export async function listNotes({ token, filter, folder, tag, search }) {
  return apiRequest('/notes', {
    token,
    params: { filter, folder, tag, search }
  });
}

// PUBLIC_INTERFACE
export async function getNote({ id, token }) {
  return apiRequest(`/notes/${id}`, { token });
}

// PUBLIC_INTERFACE
export async function createNote({ token, note }) {
  return apiRequest('/notes', { method: 'POST', data: note, token });
}

// PUBLIC_INTERFACE
export async function updateNote({ token, id, note }) {
  return apiRequest(`/notes/${id}`, { method: 'PUT', data: note, token });
}

// PUBLIC_INTERFACE
export async function deleteNote({ token, id }) {
  return apiRequest(`/notes/${id}`, { method: 'DELETE', token });
}

// PUBLIC_INTERFACE
export async function listFolders({ token }) {
  return apiRequest('/folders', { token });
}

// PUBLIC_INTERFACE
export async function listTags({ token }) {
  return apiRequest('/tags', { token });
}
