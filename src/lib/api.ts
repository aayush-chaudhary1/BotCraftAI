/**
 * API client: base URL and fetch wrapper with Bearer token and 401 refresh.
 * Access token is passed per-request (in-memory); refresh token is HttpOnly cookie.
 */

// In dev, use relative URLs so Vite proxy forwards to backend; in prod set VITE_API_URL if different origin
const API_BASE = import.meta.env.VITE_API_URL || '';

export function getApiBase(): string {
  const base = API_BASE.replace(/\/$/, '');
  return base || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
}

export interface ApiOptions extends RequestInit {
  accessToken?: string | null;
  /** If true, 401 will trigger refresh and one retry. Caller must pass getAccessToken/refresh. */
  retryOn401?: boolean;
  getAccessToken?: () => string | null;
  refresh?: () => Promise<string | null>;
}

async function doFetch(
  path: string,
  options: ApiOptions = {}
): Promise<Response> {
  const {
    accessToken,
    retryOn401,
    getAccessToken,
    refresh,
    headers = {},
    ...rest
  } = options;
  const url = path.startsWith('http') ? path : `${getApiBase()}${path}`;
  const token = accessToken ?? getAccessToken?.() ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
  const reqHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Only set application/json if not FormData and not already set
  if (!(rest.body instanceof FormData) && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    credentials: 'include',
  });

  if (res.status === 401 && retryOn401) {
    console.log('API: 401 detected, attempting refresh...');
    const newToken = refresh ? await refresh() : null;
    if (newToken) {
      console.log('API: Refresh successful, retrying request...');
      (reqHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      return fetch(url, { ...rest, headers: reqHeaders, credentials: 'include' });
    } else {
      console.error('API: Refresh failed or no refresh function provided.');
    }
  }
  return res;
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<{ data: T; ok: boolean; status: number }> {
  // If we're in a browser environment, we might be able to access the auth context refresh function
  // indirectly if we exported it, but since we can't easily import the hook here (rules of hooks),
  // we rely on the component passing it OR we rely on the caller to handle 401s if they didn't pass refresh.
  // However, since we are using a global api helper, we can't easily inject the hook.
  // BUT: we can try to read the token again from localStorage in case it was refreshed elsewhere.

  const res = await doFetch(path, options);

  // If status is 401 and we didn't retry (or retry failed), we should probably clear the token
  if (res.status === 401 && typeof localStorage !== 'undefined') {
    // localStorage.removeItem('token'); // Don't be too aggressive, maybe it was just a glitch
  }

  let data: T;
  const ct = res.headers.get('content-type');
  if (ct?.includes('application/json')) {
    try {
      const json = await res.json();
      // Auto-unwrap backend standard response { success: true, data: ... }
      if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
        data = json.data as T;
      } else {
        data = json as T;
      }
    } catch {
      data = undefined as T;
    }
  } else {
    data = undefined as T;
  }
  return { data: data as T, ok: res.ok, status: res.status };
}

export default api;
