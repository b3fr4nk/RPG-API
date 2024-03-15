import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import itemsRouter from "./routes/items";
import charactersRouter from "./routes/character";
import userRouter from "./routes/accounts";
import questRouter from "./routes/quests";

const app = express();

// Database
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
const baseRoute = "/api/v1";
app.use(`${baseRoute}/items`, itemsRouter);
app.use(`${baseRoute}/characters`, charactersRouter);
app.use(`${baseRoute}/users`, userRouter);
app.use(`${baseRoute}/quests`, questRouter);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("Server listening on port", port);
});

export default app;
