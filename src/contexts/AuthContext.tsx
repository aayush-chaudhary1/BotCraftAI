/**
 * Auth context: user state, access token in memory, login/register/logout and refresh on 401.
 * Refresh token is HttpOnly cookie; we only hold access token in memory.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getApiBase } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
  getAccessToken: () => string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const refresh = useCallback(async (): Promise<string | null> => {
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json?.data?.token) {
        setAccessToken(json.data.token);
        setUser(json.data.user ?? null);
        return json.data.token;
      }
      setAccessToken(null);
      setUser(null);
      return null;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  const loadUser = useCallback(async () => {
    const token = accessToken ?? (await refresh());
    if (!token) {
      setIsInitialized(true);
      return;
    }
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setUser(json.data);
          if (!accessToken) setAccessToken(token);
        }
      } else {
        const again = await refresh();
        if (!again) {
          setUser(null);
          setAccessToken(null);
        }
      }
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsInitialized(true);
    }
  }, [accessToken, refresh]);

  useEffect(() => {
    loadUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { data, ok, status } = await api<{ data?: { token: string; user: User }; error?: string }>(
          '/api/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          }
        );
        if (ok && data?.data?.token) {
          setAccessToken(data.data.token);
          setUser(data.data.user ?? null);
          return { success: true };
        }
        const err = (data as { error?: string })?.error || (status === 401 ? 'Invalid email or password' : 'Login failed');
        return { success: false, error: err };
      } catch (e) {
        return { success: false, error: (e as Error).message || 'Network error' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      setIsLoading(true);
      try {
        const { data, ok } = await api<{ message?: string; error?: string }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        if (ok) {
          const msg = (data as { message?: string })?.message ?? 'Registration successful. You can now log in.';
          return { success: true, message: msg };
        }
        const err = (data as { error?: string })?.error || 'Registration failed';
        return { success: false, error: err };
      } catch (e) {
        return { success: false, error: (e as Error).message || 'Network error' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${getApiBase()}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      refresh,
      getAccessToken,
      setUser,
      setAccessToken,
    }),
    [user, accessToken, isLoading, isInitialized, login, register, logout, refresh, getAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
