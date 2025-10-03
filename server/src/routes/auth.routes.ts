import {
  emailLogin,
  emailVerify,
  getNewAccessToken,
  getUser,
  googleAuthCallback,
  googleAuthUrl,
  logoutUser,
  refreshUserToken,
  updateUser,
} from "../controllers/auth.controllers.js";
import validToken from "../middlewares/validToken.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/user", validToken, getUser);
authRouter.post("/user", validToken, updateUser);
authRouter.post("/logout", validToken, logoutUser);

authRouter.post("/refresh", refreshUserToken);
authRouter.get("/refresh", getNewAccessToken);

authRouter.post("/email/login", emailLogin);
authRouter.post("/email/verify", emailVerify);

authRouter.get("/google/url", googleAuthUrl);
authRouter.get("/google/callback", googleAuthCallback);

export default authRouter;
