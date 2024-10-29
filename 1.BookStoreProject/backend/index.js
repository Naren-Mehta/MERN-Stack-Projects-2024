/* Libraries */
import express from "express";
import cors from "cors";

/** routers */
import bookRouter from "./routes/books.js";

import { PORT } from "./config.js";
import dbConnect from "./database.js";

const app = express();

// Middleware to parse incoming JSON request body
app.use(express.json());

// Middleware for handling CORS Policy
// app.use(
//   cors()
// );

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello welcome to the world!");
});

app.use("/books", bookRouter);

dbConnect()
  .then(() => {
    console.log("Database connection established..");

    app.listen(PORT, () => {
      console.log("NODE js app is listinging to port ", PORT);
    });
  })
  .catch((e) => {
    console.error("Failed while connecting with DB: ", e);
  });
