const fs = require("fs");
const path = require("path");
const { readBooksData, writeBooksData } = require("../models/books");

const getAllBooks = (req, res) => {
  const { genre, year, page, limit } = req.query;
  const books = readBooksData();
  let filteredBooks = [...books];

  if (genre) {
    const filteredBooks = books.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "Bu türde bir kitap bulunamadı" });
    }
    return res.json(filteredBooks);
  }

  if (year) {
    const filteredBooks = books.filter((book) => book.year === Number(year));
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "Bu yılda bir kitap bulunamadı" });
    }
    return res.json(filteredBooks);
  }

  if (page && limit) {
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const totalPages = Math.ceil(filteredBooks.length / Number(limit));
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    if (paginatedBooks.length === 0) {
      return res.status(404).json({
        message: "Bu kriterlere uygun kitap bulunamadı",
      });
    }

    return res.json({
      currentPage: Number(page),
      totalPages: totalPages,
      totalBooks: filteredBooks.length,
      booksPerPage: Number(limit),
      books: paginatedBooks,
    });
  }

  res.json(books);
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  const books = readBooksData();
  const book = books.find((book) => book.id === Number(bookId));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Kitap bulunamadı" });
  }
};

const createBook = (req, res) => {
  const newBook = req.body;
  let books = readBooksData();

  const maxId = Math.max(...books.map((book) => book.id), 0);
  newBook.id = maxId + 1;

  books = [...books, newBook];
  writeBooksData(books);
  res.status(201).json(books);
};

const updateBook = (req, res) => {
  const { bookId } = req.params;
  const { title, author, year, genre, pages } = req.body;
  let books = readBooksData();
  const findBook = books.find((book) => book.id === Number(bookId));
  if (findBook) {
    books = books.map((book) =>
      book.id === Number(bookId)
        ? { ...book, title, author, year, genre, pages }
        : book
    );
    writeBooksData(books);
    res.status(200).json(books);
  } else {
    res.status(404).json({ message: "Kitap bulunamadı" });
  }
};

const deleteBook = (req, res) => {
  const { bookId } = req.params;
  let books = readBooksData();

  const bookExists = books.some((book) => book.id === Number(bookId));

  if (!bookExists) {
    return res.status(404).json({
      message: "Silinecek kitap bulunamadı",
    });
  }

  books = books.filter((book) => book.id !== Number(bookId));
  writeBooksData(books);
  res.status(204).send();
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
