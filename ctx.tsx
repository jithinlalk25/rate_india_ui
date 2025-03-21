import React from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  updateUserId: (data: any) => void;
  session?: string | null;
  userId?: any;
  isLoading: boolean;
}>({
  signIn: (token) => null,
  signOut: () => null,
  updateUserId: (data) => null,
  session: null,
  userId: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[_, userId], setUserId] = useStorageState("userId");

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        updateUserId: (data) => {
          setUserId(data);
        },
        session,
        userId,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
