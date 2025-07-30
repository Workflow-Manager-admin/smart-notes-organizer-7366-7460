/**
 * AuthForm: Login/Register UI
 * Props:
 *   onLogin(email, password)
 *   onRegister(email, password)
 *   loading, error
 */
import React, { useState } from "react";
import "../styles/AuthForm.css";

// PUBLIC_INTERFACE
export default function AuthForm({ onLogin, onRegister, loading, error }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="auth-form">
      <h2>{mode === "login" ? "Sign In" : "Sign Up"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "login") onLogin(email, password);
          else onRegister(email, password);
        }}
      >
        <input
          autoFocus
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <div className="auth-form-switch">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button onClick={() => setMode("register")}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Sign In</button>
          </>
        )}
      </div>
      {error && <div className="auth-form-error">{error}</div>}
    </div>
  );
}
