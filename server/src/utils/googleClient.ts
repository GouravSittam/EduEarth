import { OAuth2Client } from "google-auth-library";
import { googleClientId, googleClientSecret, googleRedirectUrl } from "./auth.js";

export const oAuth2Client = new OAuth2Client(
  googleClientId,
  googleClientSecret,
  googleRedirectUrl
);
