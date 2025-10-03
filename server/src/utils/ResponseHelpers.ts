import { Response } from "express";
export function sendResponse({
  res,
  success,
  message,
  data,
  error,
  statusCode,
}: ApiResponse & { res: Response; statusCode?: number }): Response {
  return res.status(statusCode || (success ? 200 : 500)).json({
    success,
    message,
    data,
    error,
  });
}
