interface ApiResponse {
  success: boolean;
  message?: string;
  data?: object | string;
  error?: {
    message: string;
    details?: any;
  };
}
