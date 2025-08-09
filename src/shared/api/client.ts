/*
  API クライアント
  - BASE_URL は VITE_API_BASE_URL（未設定時は http://localhost:3000）
  - トークンが設定されていれば Authorization: Token token="<JWT>" を付与
  - 401 を受けたら onUnauthorized コールバックを呼ぶ
*/

const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

let authTokenInMemory: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setToken(token: string | null): void {
  authTokenInMemory = token;
}

export function setOnUnauthorized(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

type Json = unknown;

async function parseJsonSafe(response: Response): Promise<Json | undefined> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export type HttpError = Error & { status: number; json: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function request(
  path: string,
  init: RequestInit = {}
): Promise<unknown> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body)
    headers.set("Content-Type", "application/json");
  if (authTokenInMemory)
    headers.set("Authorization", `Token token="${authTokenInMemory}"`);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && onUnauthorized) {
    await parseJsonSafe(response).catch(() => undefined);
    onUnauthorized();
  }

  const json = await parseJsonSafe(response);
  if (!response.ok) {
    let message: string | undefined;
    if (isRecord(json)) {
      const maybeError = (json as Record<string, unknown>).error;
      const maybeMessage = (json as Record<string, unknown>).message;
      message =
        typeof maybeError === "string"
          ? maybeError
          : typeof maybeMessage === "string"
          ? maybeMessage
          : undefined;
    }
    const error: HttpError = Object.assign(
      new Error(message ?? "Request failed"),
      {
        status: response.status,
        json,
      }
    );
    throw error;
  }
  return json;
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) =>
    request(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (path: string, body?: unknown) =>
    request(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: (path: string, body?: unknown) =>
    request(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (path: string) => request(path, { method: "DELETE" }),
  setToken,
  setOnUnauthorized,
};

export type ApiClient = typeof api;
