const express = require("express");
const app = express();
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//middleware json parse işlemi
app.use(express.json());

const filePath = "books.json";

const readBooksData = () => {
  const booksData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(booksData);
};

const writeBooksData = (books) => {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
};

function isBooks(req, res, next) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([])); // Dosya yoksa boş bir dizi oluştur
    }
    const books = readBooksData();
    if (!Array.isArray(books)) {
      writeBooksData([]); // Eğer kitap verisi bozuksa, sıfırla
    }
  } catch (error) {
    writeBooksData([]); // Hata olması durumunda sıfırla
  }
  next();
}

const validateBookData = (req, res, next) => {
  const { title, author, year, genre, pages } = req.body;

  // Zorunlu alanları kontrol et
  if (!title || !author || !year || !genre || !pages) {
    return res.status(400).json({
      message:
        "Eksik bilgi. Tüm alanlar (title, author, year, genre, pages) zorunludur.",
    });
  }

  // Veri tiplerini kontrol et
  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof genre !== "string"
  ) {
    return res.status(400).json({
      message: "title, author ve genre string olmalıdır.",
    });
  }

  if (typeof year !== "number" || typeof pages !== "number") {
    return res.status(400).json({
      message: "year ve pages sayı olmalıdır.",
    });
  }

  // Aynı başlıkta kitap kontrolü
  const books = readBooksData();
  const existingBook = books.find(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (existingBook) {
    return res.status(400).json({
      message: "Bu başlıkta bir kitap zaten mevcut.",
    });
  }

  next();
};

app.get("/books", isBooks, (req, res) => {
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
});

app.get("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  const books = readBooksData();
  const book = books.find((book) => book.id === Number(bookId));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Kitap bulunamadı" });
  }
});

app.post("/books", validateBookData, (req, res) => {
  const newBook = req.body;
  let books = readBooksData();

  // Yeni ID oluştur
  const maxId = Math.max(...books.map((book) => book.id), 0);
  newBook.id = maxId + 1;

  books = [...books, newBook];
  writeBooksData(books);
  res.status(201).json(books);
});

app.put("/books/:bookId", (req, res) => {
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
});

app.delete("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  let books = readBooksData();

  // Önce kitabın var olup olmadığını kontrol et
  const bookExists = books.some((book) => book.id === Number(bookId));

  if (!bookExists) {
    return res.status(404).json({
      message: "Silinecek kitap bulunamadı",
    });
  }

  // Kitap varsa silme işlemini gerçekleştir
  books = books.filter((book) => book.id !== Number(bookId));
  writeBooksData(books);
  res.status(204).send();
});
