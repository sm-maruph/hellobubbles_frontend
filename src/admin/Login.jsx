import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./admin.css";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error.message);
    else navigate("/admin");
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__sub">Hello Bubbles dashboard</p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="admin-btn" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
