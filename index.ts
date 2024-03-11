import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// routes

app.listen("3000", () => {
  console.log("Server listening on port 3000");
});

export default app;
