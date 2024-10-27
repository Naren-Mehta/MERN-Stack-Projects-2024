/* Libraries */
import express from "express";
import mongoose from "mongoose";

import { PORT } from "./config.js";
import dbConnect from "./database.js";

// Modals
import Book from "./models/book.js";

const app = express();

// Middleware to parse incoming JSON request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello welcome to the world!");
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({
        massage: "Send all required fields: title, author, publishYear",
      });
    }

    const newBook = {
      title,
      author,
      publishYear,
    };

    const book = await Book.create(newBook);

    res.status(201).send(book);
  } catch (err) {
    console.log(err.massage);
    return res.status(500).send({ message: err.message });
  }
});

/** Get all Books */
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(201).send({
      count: books.length,
      books,
    });
  } catch (err) {
    console.err(err.massage);
    return res.status(500).send({ message: err.message });
  }
});

/** Get book by id */
app.get("/books/:id", async (req, res) => {
  try {
    const id = req.params;
    const book = await Book.findById(id);

    return res.status(201).send(book);
  } catch (err) {
    console.log(err.massage);
    return res.status(500).send({ message: err.message });
  }
});

/** Update Book by id */
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if bookId is a valid MongoDB ObjectId
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({
        massage: "Send all required fields: title, author, publishYear",
      });
    }

    const bookObj = {
      title,
      author,
      publishYear,
    };

    const request = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear },
      {
        new: true, // Return the updated document directly
      }
    );

    // Check if the book was found and updated
    if (!request) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(201).send({ message: "Book updated successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

/** Delte Book by id */
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const request = await Book.findByIdAndDelete(id);

    if (!request) {
      return res.status(400).send({ message: "Not able to delte book" });
    }

    return res
      .status(500)
      .send({ message: `Book with id: ${id} deleted successfully` });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

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
