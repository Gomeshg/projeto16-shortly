import { Router } from "express";

import { signUp, signIn } from "../controllers/userController.js";
import privateRoute from "../middlewares/privateRoute.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

export default userRouter;
