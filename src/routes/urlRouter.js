import { Router } from "express";
import privateRoute from "../middlewares/privateRoute.js";
import { insert, read } from "../controllers/urlController.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", privateRoute, insert);
urlRouter.get("/urls/:id", read);

export default urlRouter;
