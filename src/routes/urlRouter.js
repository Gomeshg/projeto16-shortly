import { Router } from "express";
import privateRoute from "../middlewares/privateRoute.js";
import { insert, read, redirect } from "../controllers/urlController.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", privateRoute, insert);
urlRouter.get("/urls/:id", read);
urlRouter.get("/urls/open/:shortUrl", redirect);

export default urlRouter;
