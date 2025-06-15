const Book = require("../models/Book");
const {
  sendBookCreationEmail,
} = require("../middleware/send-email.middleware");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new book
exports.createBook = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Authenticated user:", req.user);

    const { title, author, year } = req.body;

    // Validate required fields
    if (!title || !author || !year) {
      return res.status(400).json({
        message: "Title, author, and year are required",
        receivedData: req.body,
      });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1000 || year > currentYear + 10) {
      return res.status(400).json({
        message: `Year must be between 1000 and ${currentYear + 10}`,
        receivedData: { year },
      });
    }

    const newBook = new Book({
      title,
      author,
      year,
    });

    const savedBook = await newBook.save();
    console.log("Book saved successfully:", savedBook);

    // Send email notification (don't let email failures break book creation)
    try {
      if (req.user && req.user.email) {
        console.log("Sending email notification to:", req.user.email);
        const emailResult = await sendBookCreationEmail(
          title,
          author,
          year,
          req.user.email
        );
        console.log("Email notification result:", emailResult);
      } else {
        console.warn(
          "No user email found in token, skipping email notification"
        );
      }
    } catch (emailError) {
      console.error(
        "Email notification failed, but book was created successfully:",
        emailError.message
      );
    }

    res.status(201).json({
      ...savedBook.toObject(),
      message: "Book created successfully",
    });
  } catch (error) {
    console.error("Book creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, year },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
