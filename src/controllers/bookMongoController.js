const BookMongo = require("../models/bookMongo");
const multer = require("multer");
const sharp = require("sharp");

// Multer ayarları
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // max 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Lütfen sadece resim dosyası yükleyin."));
    }
  },
}).single("image");

const getAllBooks = async (req, res) => {
  try {
    const { language, lang = "tr" } = req.query;
    let query = {};

    if (language) {
      query.language = language;
    }

    const books = await BookMongo.find(query).lean();

    // Her kitap için lokalize edilmiş verileri döndür
    const localizedBooks = books.map((book) => ({
      _id: book._id,
      title: book.title[lang] || book.title.tr,
      author: book.author[lang] || book.author.tr,
      genre: book.genre[lang] || book.genre.tr,
      description: book.description?.[lang] || book.description?.tr,
      pages: book.pages,
      language: book.language,
      image: book.image,
      imageType: book.imageType,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));

    res.status(200).json(localizedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "Dosya boyutu 2MB'dan küçük olmalıdır." });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      let imageData = null;
      let imageType = null;

      if (req.file) {
        // Resmi optimize et
        const optimizedImageBuffer = await sharp(req.file.buffer)
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        imageData = optimizedImageBuffer;
        imageType = "image/jpeg";
      }

      // Form verilerini çoklu dil yapısına uygun şekilde düzenle
      const bookData = {
        title: {
          tr: req.body.title_tr,
          en: req.body.title_en,
        },
        author: {
          tr: req.body.author_tr,
          en: req.body.author_en,
        },
        genre: {
          tr: req.body.genre_tr,
          en: req.body.genre_en,
        },
        description: {
          tr: req.body.description_tr,
          en: req.body.description_en,
        },
        pages: Number(req.body.pages),
        language: req.body.language,
        image: imageData,
        imageType: imageType,
      };

      const saveBook = await BookMongo.create(bookData);
      res.status(201).json(saveBook);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updateBook = await BookMongo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await BookMongo.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};
