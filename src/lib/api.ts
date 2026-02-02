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
  const token = accessToken ?? getAccessToken?.() ?? null;
  const reqHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  if (token) {
    (reqHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    credentials: 'include',
  });

  if (res.status === 401 && retryOn401 && refresh) {
    const newToken = await refresh();
    if (newToken) {
      (reqHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      return fetch(url, { ...rest, headers: reqHeaders, credentials: 'include' });
    }
  }
  return res;
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<{ data: T; ok: boolean; status: number }> {
  const res = await doFetch(path, options);
  let data: T;
  const ct = res.headers.get('content-type');
  if (ct?.includes('application/json')) {
    try {
      data = (await res.json()) as T;
    } catch {
      data = undefined as T;
    }
  } else {
    data = undefined as T;
  }
  return { data: data as T, ok: res.ok, status: res.status };
}

export default api;
