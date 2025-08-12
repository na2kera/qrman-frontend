import { useState } from "react";
import { Link } from "react-router";
import { authStore } from "../../../app/store";

type LoginPageProps = {
  onSuccess?: () => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authStore.login(email.trim(), password);
      onSuccess?.();
    } catch (err) {
      const message = (err as Error).message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
            autoComplete="email"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
            autoComplete="current-password"
          />
        </div>
        {error ? (
          <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
        ) : null}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
}

export default LoginPage;
