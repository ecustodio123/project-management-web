import { useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, syncCognitoUser } from "../features/auth/authApi";
import type { AuthResponse, User } from "../types/auth";
import { AuthContext } from "./authContext";
import { tokenStorage } from "./tokenStorage";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const completeCognitoLogin = useCallback(async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error("Missing Cognito ID token");
    }

    const syncedUser = await syncCognitoUser(idToken);

    tokenStorage.set(idToken);
    setToken(idToken);
    setUser(syncedUser);

    return syncedUser;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const storedToken = tokenStorage.get();

        if (storedToken) {
          const currentUser = await getMe();

          if (!isMounted) return;

          setToken(storedToken);
          setUser(currentUser);
          return;
        }

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          if (!isMounted) return;

          setUser(null);
          return;
        }

        const syncedUser = await syncCognitoUser(idToken);

        if (!isMounted) return;

        tokenStorage.set(idToken);
        setToken(idToken);
        setUser(syncedUser);
      } catch {
        if (!isMounted) return;

        setUser(null);
        setToken(null);
        tokenStorage.clear();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = useCallback(async () => {
    await signOut();

    setUser(null);
    setToken(null);
    tokenStorage.clear();

    queryClient.clear();
  }, [queryClient]);

  const setSession = useCallback(async (auth: AuthResponse) => {
    tokenStorage.set(auth.access_token);
    setToken(auth.access_token);

    if (auth.user) {
      setUser(auth.user);
      return;
    }

    const currentUser = await getMe();
    setUser(currentUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      completeCognitoLogin,
      setSession,
      logout,
    }),
    [user, token, isLoading, completeCognitoLogin, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
