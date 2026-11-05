const PROD_SERVER_URL = "https://edu-earth-backend.vercel.app";
const LOCAL_SERVER_URL = "http://localhost:6969";

export const getServerUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const normalizedEnvUrl = envUrl?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalEnvUrl =
    normalizedEnvUrl?.includes("localhost") ||
    normalizedEnvUrl?.includes("127.0.0.1");

  // Docker/local production builds opt in to keep a localhost API URL;
  // otherwise a stale localhost value falls back to the deployed backend.
  const allowLocal = process.env.NEXT_PUBLIC_ALLOW_LOCAL_SERVER === "true";

  if (normalizedEnvUrl && (!isProduction || !isLocalEnvUrl || allowLocal)) {
    return normalizedEnvUrl;
  }

  return isProduction ? PROD_SERVER_URL : LOCAL_SERVER_URL;
};

export const SERVER_URL = getServerUrl();
