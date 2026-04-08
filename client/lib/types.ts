export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  isAdmin?: boolean;
}
