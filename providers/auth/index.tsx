"use client";

import { getUser, login } from "@/actions/users";
import { User } from "@/payload-types";
import React, {
  createContext,
  PropsWithChildren,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type AuthContextType = {
  user: User | null;
  refetch: () => void;
  fetching: boolean;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  userFetched: boolean;
};

const Context = createContext({} as AuthContextType);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(false);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    if (!userFetched) fetchUser();
  }, [userFetched]);

  const fetchUser = useCallback(async () => {
    setFetching(true);
    const res = await getUser();
    if (res.member) {
      setUser(res.member);
    }
    setFetching(false);
    setUserFetched(true);
  }, []);

  const loginUser = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      await login({ email, password });
      await fetchUser();
    },
    []
  );

  const logout = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res) {
      setUser(null);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchUser();
  }, []);

  return (
    <Context.Provider
      value={{ fetching, user, refetch, logout, userFetched, login: loginUser }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Auth context not found");

  return context;
};
