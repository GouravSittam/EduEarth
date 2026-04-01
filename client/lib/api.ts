import type { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:6969";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function api<T>(
  path: string,
  method: Method = "GET",
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const result: ApiResponse<T> = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result?.error?.message || result?.message || `API error ${res.status}`);
  }
  return result;
}

export const server = {
  get: <T>(path: string) => api<T>(path, "GET"),
  post: <T>(path: string, body?: Record<string, unknown>) =>
    api<T>(path, "POST", body),
  put: <T>(path: string, body?: Record<string, unknown>) =>
    api<T>(path, "PUT", body),
  patch: <T>(path: string, body?: Record<string, unknown>) =>
    api<T>(path, "PATCH", body),
  delete: <T>(path: string) => api<T>(path, "DELETE"),
};

export const authApi = {
  loginWithEmail: (email: string) =>
    server.post<{ otpExpiresAt: string }>("/auth/email/login", { email }),
  verifyOtp: (email: string, otp: string) =>
    server.post<{ otpExpiresAt: string }>("/auth/email/verify", { email, otp }),
  getUser: () => server.get("/auth/user"),
  logout: () => server.post("/auth/logout"),
  googleAuthUrl: () => server.get<{ url: string }>("/auth/google/url"),
  refresh: () => server.post("/auth/refresh"),
};

export { BASE_URL };
