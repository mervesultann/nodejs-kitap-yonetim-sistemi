const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");
const { validateBookData } = require("../models/books");
const { registerUser, loginUser } = require("../controllers/authController");

router.get("/", getAllBooks);
router.get("/:bookId", getBookById);
router.post("/", validateBookData, createBook);
router.put("/:bookId", validateBookData, updateBook);
router.delete("/:bookId", deleteBook);

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;
