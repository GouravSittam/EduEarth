// API response types matching the server's sendResponse format
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
}

export interface SignInResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResult {
  user: User;
  otpExpiresAt?: string;
}

export interface OtpVerifyResult {
  message: string;
}

export interface GoogleAuthUrlResult {
  url: string;
}
