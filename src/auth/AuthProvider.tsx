import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";
import { syncCognitoUser } from "../features/auth/authApi";
import type { User } from "../types/auth";
import { AuthContext } from "./authContext";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const initializedRef =
    useRef(false);
  const syncedTokenRef =
    useRef<string | null>(null);
  const syncedUserRef =
    useRef<User | null>(null);

  const completeCognitoLogin =
    useCallback(async () => {
      const session =
        await fetchAuthSession();

      const idToken =
        session.tokens?.idToken?.toString();

      if (!idToken) {
        throw new Error(
          "Missing Cognito ID token",
        );
      }

      if (
        syncedTokenRef.current ===
          idToken &&
        syncedUserRef.current
      ) {
        return syncedUserRef.current;
      }

      const syncedUser =
        await syncCognitoUser(
          idToken,
        );

      syncedTokenRef.current =
        idToken;
      syncedUserRef.current =
        syncedUser;
      setUser(syncedUser);

      return syncedUser;
    }, []);

  useEffect(() => {
    if (
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current =
      true;

    const initializeAuth =
      async () => {
        try {
          await completeCognitoLogin();
      } catch {
        syncedTokenRef.current =
          null;
        syncedUserRef.current =
          null;
        setUser(null);
      } finally {
          setIsLoading(false);
        }
      };

    initializeAuth();
  }, [completeCognitoLogin]);

  const logout =
    useCallback(async () => {
      await signOut();

      syncedTokenRef.current =
        null;
      syncedUserRef.current =
        null;
      setUser(null);
    }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated:
        !!user,
      isLoading,
      completeCognitoLogin,
      logout,
    }),
    [
      user,
      isLoading,
      completeCognitoLogin,
      logout,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}
