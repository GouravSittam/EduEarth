import { getUser, updateUser } from "../controllers/auth.controllers.js";
import validToken from "../middlewares/validToken.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/user", validToken, getUser);
authRouter.post("/user", validToken, updateUser);
authRouter.patch("/user", validToken, updateUser);

export default authRouter;
