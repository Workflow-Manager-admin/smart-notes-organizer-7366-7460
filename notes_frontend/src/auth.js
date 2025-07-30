/**
 * Authentication context and hooks for user login state, session, registration.
 * Uses Context for global state management.
 */
import React, { createContext, useState, useContext, useEffect } from "react";
import { login, register, logout, getMe } from "./api";

// AuthContext to provide user/session state globally
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, try restore user session with token
  useEffect(() => {
    if (token) {
      getMe({ token }).then(
        (u) => {
          setUser(u);
          setLoading(false);
        },
        () => {
          setToken("");
          setUser(null);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  async function handleLogin(email, password) {
    try {
      setLoading(true);
      setError(null);
      const resp = await login({ email, password });
      setToken(resp.token);
      localStorage.setItem("token", resp.token);
      setUser(resp.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setUser(null);
      setToken("");
      return false;
    }
  }

  // PUBLIC_INTERFACE
  async function handleRegister(email, password) {
    try {
      setLoading(true);
      setError(null);
      const resp = await register({ email, password });
      setToken(resp.token);
      localStorage.setItem("token", resp.token);
      setUser(resp.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setUser(null);
      setToken("");
      return false;
    }
  }

  // PUBLIC_INTERFACE
  async function handleLogout() {
    setLoading(true);
    try {
      await logout({ token });
    } catch {}
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  }

  const ctx = { user, token, loading, error, login: handleLogin, register: handleRegister, logout: handleLogout };
  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
