import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useToast } from "../components/ToastProvider";
import { apiGet, apiPost, setApiAuthToken } from "../lib/api";

export type UserRole = "admin" | "manager" | "viewer";

export interface AuthUserProfile {
  username: string;
  full_name: string;
  role: UserRole;
  disabled: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUserProfile;
}

interface StoredSession {
  token: string;
  user: AuthUserProfile;
}

interface AuthContextValue {
  user: AuthUserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  canWrite: boolean;
  canDelete: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY = "hyperdeck.auth.v1";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): StoredSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.token || !parsed.user) {
      return null;
    }
    return {
      token: parsed.token,
      user: parsed.user
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { pushToast } = useToast();

  const persistSession = useCallback((nextToken: string, nextUser: AuthUserProfile): void => {
    setToken(nextToken);
    setUser(nextUser);
    setApiAuthToken(nextToken);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser
      } satisfies StoredSession)
    );
  }, []);

  const clearSession = useCallback(
    (mode: "silent" | "expired" | "logout" = "silent"): void => {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      window.localStorage.removeItem(STORAGE_KEY);

      if (mode === "expired") {
        pushToast({
          tone: "error",
          title: "Session expired",
          description: "Please sign in again to continue."
        });
      }

      if (mode === "logout") {
        pushToast({
          tone: "info",
          title: "Signed out",
          description: "You can sign in again any time."
        });
      }
    },
    [pushToast]
  );

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!token) {
      return;
    }

    try {
      const profile = await apiGet<AuthUserProfile>("/auth/me");
      setUser(profile);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token,
          user: profile
        } satisfies StoredSession)
      );
    } catch {
      clearSession("expired");
      throw new Error("Session expired. Please sign in again.");
    }
  }, [clearSession, token]);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      const payload = await apiPost<LoginResponse>(
        "/auth/login",
        { username, password },
        { skipAuth: true }
      );
      persistSession(payload.access_token, payload.user);
      pushToast({
        tone: "success",
        title: "Welcome back",
        description: `${payload.user.full_name} is now online in ${payload.user.role} mode.`
      });
    },
    [persistSession, pushToast]
  );

  const logout = useCallback((): void => {
    clearSession("logout");
  }, [clearSession]);

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setIsBootstrapping(false);
      return;
    }

    persistSession(stored.token, stored.user);

    void (async () => {
      try {
        const profile = await apiGet<AuthUserProfile>("/auth/me");
        setUser(profile);
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: stored.token,
            user: profile
          } satisfies StoredSession)
        );
      } catch {
        clearSession();
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, [clearSession, persistSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      canWrite: user?.role === "admin" || user?.role === "manager",
      canDelete: user?.role === "admin",
      login,
      logout,
      refreshProfile
    }),
    [isBootstrapping, login, logout, refreshProfile, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
