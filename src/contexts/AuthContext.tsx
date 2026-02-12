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

      const token = json?.data?.token || json?.token;

      if (res.ok && token) {
        setAccessToken(token);
        localStorage.setItem('token', token);
        setUser(json?.data?.user || json?.user || null);
        return token;
      }
      setAccessToken(null);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    } catch {
      setAccessToken(null);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    }
  }, []);

  const loadUser = useCallback(async () => {
    const token = accessToken ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) ?? (await refresh());
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
          if (!accessToken) {
            setAccessToken(token);
            localStorage.setItem('token', token);
          }
        }
      } else {
        const again = await refresh();
        if (!again) {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem('token');
        }
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('token');
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
        if (ok) {
          // Robust token parsing
          const responseData = data as any;
          const token = responseData?.data?.token || responseData?.token || responseData?.accessToken;
          const user = responseData?.data?.user || responseData?.user;

          console.log("LOGIN RESPONSE DEBUG:", { ok, hasToken: !!token, keys: Object.keys(responseData || {}) });

          if (token) {
            setAccessToken(token);
            localStorage.setItem('token', token);
            console.log("Token saved to localStorage");
            if (user) setUser(user);
            return { success: true };
          }
        }

        const err = (data as { error?: string })?.error || (status === 401 ? 'Invalid email or password' : 'Login failed');
        return { success: false, error: err };
      } catch (e) {
        console.error("Login Error:", e);
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
      localStorage.removeItem('token');
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
