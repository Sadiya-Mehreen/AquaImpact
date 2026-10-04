import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../types";
import { api } from "../lib/api";

interface Toast {
  id: number;
  message: string;
  tone: "info" | "success" | "error";
}

interface AppContextValue {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
  toasts: Toast[];
  showToast: (message: string, tone?: Toast["tone"]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const toastId = Date.now() + Math.random();
    setToasts((t) => [...t, { id: toastId, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== toastId));
    }, 3400);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!api.getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, setUser, refreshUser, logout, toasts, showToast }),
    [user, loading, refreshUser, logout, toasts, showToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
