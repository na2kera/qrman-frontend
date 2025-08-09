import {
  api,
  setToken as setApiToken,
  setOnUnauthorized,
} from "../shared/api/client";

type User = { id: number; email: string };
type AuthState = { user: User | null; token: string | null };

const STORAGE_KEY = "qrman_auth";

function readStorage(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

function writeStorage(state: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const authStore = {
  state: { user: null, token: null } as AuthState,
  load(): void {
    const saved = readStorage();
    if (saved) {
      this.state = saved;
      setApiToken(saved.token);
    }
    setOnUnauthorized(() => {
      this.clear();
      // ルーター導入後はログインページへ遷移（v7 手動導入想定）
    });
  },
  set(next: AuthState): void {
    this.state = next;
    setApiToken(next.token);
    writeStorage(next);
  },
  clear(): void {
    this.state = { user: null, token: null };
    setApiToken(null);
    localStorage.removeItem(STORAGE_KEY);
  },
  async login(email: string, password: string): Promise<User> {
    const res = await api.post("/api/v1/login", { email, password });
    const user = (res as { user: User }).user;
    const token = (res as { token: string }).token;
    this.set({ user, token });
    return user;
  },
  async signup(
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<User> {
    const res = await api.post("/api/v1/signin", {
      user: { email, password, password_confirmation: passwordConfirmation },
    });
    const user = (res as { user: User }).user;
    const token = (res as { token: string }).token;
    this.set({ user, token });
    return user;
  },
};

export type { User, AuthState };
