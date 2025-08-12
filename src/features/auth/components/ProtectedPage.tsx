import { useEffect, useState } from "react";
import { fetchProtected } from "../../auth/api/auth";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = (await fetchProtected()) as { message?: string };
        setMessage(res?.message ?? "OK");
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const qrman_auth = localStorage.getItem("qrman_auth");
  console.log(qrman_auth);
  return <div>Protected resource: {message}</div>;
}
