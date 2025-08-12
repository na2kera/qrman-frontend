import { useState } from "react";
import { authStore } from "../../../app/store";

type SignupPageProps = {
  onSuccess?: () => void;
};

export function SignupPage({ onSuccess }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authStore.signup(email.trim(), password, passwordConfirmation);
      onSuccess?.();
    } catch (err) {
      const message = (err as Error).message || "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "0 auto" }}>
      <h2>Sign Up</h2>
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
            autoComplete="new-password"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            style={{ width: "100%" }}
            autoComplete="new-password"
          />
        </div>
        {error ? (
          <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>
        ) : null}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default SignupPage;

