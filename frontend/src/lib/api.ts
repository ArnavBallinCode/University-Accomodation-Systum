export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
let authToken: string | null = null;

export function setApiAuthToken(token: string | null): void {
  authToken = token;
}

function buildUrl(path: string): string {
  if (!API_BASE) {
    return path;
  }

  return `${API_BASE}${path}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function asErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object" && "detail" in payload) {
    const detail = (payload as Record<string, unknown>).detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  return fallback;
}

export async function apiRequest<T>(path: string, init: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...requestInit } = init;
  const headers = new Headers(requestInit.headers ?? {});

  if (!(requestInit.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth && authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(buildUrl(path), {
    ...requestInit,
    headers
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(response.status, asErrorMessage(payload, `Request failed with status ${response.status}`));
  }

  return payload as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body: unknown, init: ApiRequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "POST", body: JSON.stringify(body) });
}

export function apiPut<T>(path: string, body: unknown, init: ApiRequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) });
}

export function apiDelete(path: string, init: ApiRequestOptions = {}): Promise<void> {
  return apiRequest<void>(path, { ...init, method: "DELETE" });
}
