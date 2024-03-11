import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";

import itemsRouter from "./routes/items";

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1", [itemsRouter]);

app.listen("3000", () => {
  console.log("Server listening on port 3000");
});

export default app;
