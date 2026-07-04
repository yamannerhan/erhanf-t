import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AuthSession,
  getSession,
  login as authLogin,
  logout as authLogout,
  UserRole,
} from '@/lib/auth';
import { getUserRoleByCredentials, insertAppUser } from '@/lib/userDatabase';

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  addUser: (username: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  isAdmin: false,
  addUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2500);
    getSession()
      .then((s) => {
        setSession(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => clearTimeout(timeout);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await authLogin(username, password, getUserRoleByCredentials);
    if (result) {
      setSession(result);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setSession(null);
  }, []);

  const addUser = useCallback(
    async (username: string, password: string, role: UserRole) => {
      await insertAppUser(username, password, role);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        login,
        logout,
        isAdmin: session?.role === 'admin',
        addUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
