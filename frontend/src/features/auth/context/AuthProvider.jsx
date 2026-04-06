import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginStaff } from "../../../api/authApi";
import {
  clearStoredStaffSession,
  getStoredStaffSession,
  setStoredStaffSession,
  STAFF_SESSION_EVENT,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredStaffSession());

  useEffect(() => {
    const syncSession = () => {
      setSession(getStoredStaffSession());
    };

    window.addEventListener(STAFF_SESSION_EVENT, syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener(STAFF_SESSION_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const login = async (credentials) => {
    const response = await loginStaff(credentials);
    const nextSession = {
      token: response.token,
      user: {
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      },
    };

    setStoredStaffSession(nextSession);
    setSession(nextSession);
    return response;
  };

  const logout = () => {
    clearStoredStaffSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
