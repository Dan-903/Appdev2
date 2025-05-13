const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory books collection
let books = [
  {
    id: 1,
    title: "title 1",
    author: "Author 1",
  },
  {
    id: 2,
    title: "title 2",
    author: "Author 2",
  },
];

app.get("/", (req, res) => {
  res.send("Simple Book API using Node.js and Express");
});

app.get("/api/books", (req, res) => {
  console.log('GET /api/books called, current books:', books);
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }
  // Calculate next ID by finding the maximum ID and adding 1
  const maxId = books.reduce((max, book) => Math.max(max, book.id), 0);
  const newBook = {
    id: maxId + 1,
    title,
    author,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.patch("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(bookIndex, 1);
  res.json({ message: "Book successfully deleted" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
