import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/indexRouter.js";

const server = express();
server.use(json());
server.use(cors());
server.use(router);
dotenv.config();

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});
