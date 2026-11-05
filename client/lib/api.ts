import type {
  ApiResponse,
  ChatMessage,
  ClassSummary,
  Institution,
  InstitutionStatistics,
  LeaderboardEntry,
  User,
} from "./types";
import { checkSupabaseReachable, getSupabaseBrowserClient } from "./supabase";
import { SERVER_URL } from "./serverUrl";

const BASE_URL = SERVER_URL;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const getAuthHeaders = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (typeof window === "undefined") {
    return headers;
  }

  // If Supabase is down, call the API anonymously rather than creating a
  // client that would spam "Failed to fetch" retrying token refreshes.
  if (!(await checkSupabaseReachable())) {
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
  body?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the EduEarth server. Check your connection and try again.",
      0,
    );
  }

  // Gateways (502/504) and some errors return HTML, not JSON.
  let result: ApiResponse<T> | null = null;
  try {
    result = (await res.json()) as ApiResponse<T>;
  } catch {
    result = null;
  }

  if (!res.ok || !result?.success) {
    throw new ApiError(
      result?.error?.message || result?.message || `API error ${res.status}`,
      res.status,
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

export const leaderboardApi = {
  get: (options: { institutionId?: string; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (options.institutionId) params.set("institutionId", options.institutionId);
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.toString();
    return server.get<{ leaderboard: LeaderboardEntry[]; scope: string }>(
      `/leaderboard${query ? `?${query}` : ""}`,
    );
  },
};

export const institutionsApi = {
  search: (search: string, limit = 8) =>
    server.get<{ institutions: Institution[] }>(
      `/institutions?limit=${limit}&search=${encodeURIComponent(search)}`,
    ),
  join: (institutionId: string) =>
    server.post<{ institution: { id: string; name: string } }>(
      `/institutions/${encodeURIComponent(institutionId)}/join`,
    ),
  statistics: (institutionId: string) =>
    server.get<InstitutionStatistics>(
      `/institutions/${encodeURIComponent(institutionId)}/statistics`,
    ),
  classes: (institutionId: string) =>
    server.get<{ classes: ClassSummary[] }>(
      `/institutions/${encodeURIComponent(institutionId)}/classes?limit=50`,
    ),
};

export const classesApi = {
  create: (body: {
    name: string;
    subject: string;
    description?: string;
    institutionId: string;
  }) => server.post<ClassSummary>("/classes", body),
};

export const assistantApi = {
  chat: (messages: ChatMessage[]) =>
    server.post<{ reply: ChatMessage }>("/assistant/chat", { messages }),
};

export { BASE_URL };
