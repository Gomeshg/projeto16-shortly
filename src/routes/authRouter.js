import { Router } from "express";

import { signUp, signIn } from "../controllers/authController.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

export default userRouter;
