import type { ApiResponse, User } from "./types";
import { getSupabaseBrowserClient } from "./supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:6969";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const getAuthHeaders = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (typeof window === "undefined") {
    return headers;
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
  } catch (error) {
    console.warn("Unable to read Supabase session for API request", error);
  }

  return headers;
};

async function api<T>(
  path: string,
  method: Method = "GET",
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: await getAuthHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const result: ApiResponse<T> = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(
      result?.error?.message || result?.message || `API error ${res.status}`
    );
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
  getUser: () => server.get<{ user: User }>("/auth/user"),
  updateUser: (body: Record<string, unknown>) =>
    server.patch<{ user: User }>("/auth/user", body),
};

export { BASE_URL };
