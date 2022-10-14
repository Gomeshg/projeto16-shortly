import express from "express";
import dotenv from "dotenv";
import router from "./routes/indexRouter.js";

const server = express();
server.use(express.json());
dotenv.config();
server.use(router);

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});
