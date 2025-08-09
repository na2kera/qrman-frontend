import { api } from "../../../shared/api/client";
import type { User } from "../../../app/store";

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await api.post("/api/v1/login", { email, password });
  return res as { user: User; token: string };
}

export async function signup(
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ user: User; token: string }> {
  const res = await api.post("/api/v1/signin", {
    user: { email, password, password_confirmation: passwordConfirmation },
  });
  return res as { user: User; token: string };
}

export async function fetchProtected(): Promise<{
  message: string;
  user: User;
}> {
  const res = await api.get("/api/v1/protected_resource");
  return res as { message: string; user: User };
}
