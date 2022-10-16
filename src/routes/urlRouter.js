import { Router } from "express";
import privateRoute from "../middlewares/privateRoute.js";
import { insert } from "../controllers/urlController.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", privateRoute, insert);
// urlRouter.get();

export default urlRouter;
