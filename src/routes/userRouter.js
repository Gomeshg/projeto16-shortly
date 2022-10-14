import { Router } from "express";

import { signUp } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
// userRouter.get("/signin", signIn);

export default userRouter;
