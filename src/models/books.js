const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../books.json");

const readBooksData = () => {
  const booksData = fs.readFileSync(filePath, "utf-8");
  //return JSON.parse(booksData);
  return booksData.trim() ? JSON.parse(booksData) : [];
};

const writeBooksData = (books) => {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
};

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

module.exports = {
  readBooksData,
  writeBooksData,
  validateBookData,
};
