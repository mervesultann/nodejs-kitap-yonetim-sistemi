const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      tr: {
        type: String,
        required: true, // Kitap başlığı zorunlu
        trim: true,
      },
      en: {
        type: String,
        required: false,
        trim: true,
      },
    },
    author: {
      tr: {
        type: String,
        required: true, // Yazar adı zorunlu
      },
      en: {
        type: String,
        required: false,
      },
    },
    genre: {
      tr: {
        type: String,
        required: true, // Tür zorunlu
      },
      en: {
        type: String,
        required: false,
      },
    },

    description: {
      tr: {
        type: String,
        required: false, // Açıklama isteğe bağlı
      },
      en: {
        type: String,
        required: false,
      },
    },
    pages: {
      type: Number,
      required: true, // Sayfa sayısı zorunlu
    },

    language: {
      type: String,
      required: true,
      enum: ["Türkçe", "İngilizce"], // Desteklenen diller
    },
    image: {
      type: Buffer, // Resim verisi binary olarak saklanacak
      required: false,
    },
    imageType: {
      type: String, // Resim MIME tipi (örn: image/jpeg, image/png)
      required: false,
    },
  },
  { timestamps: true }
);

// Dile göre kitap verilerini döndüren virtual alan
bookSchema.virtual("localizedData").get(function (lang = "tr") {
  return {
    _id: this._id,
    title: this.title[lang] || this.title.tr,
    author: this.author[lang] || this.author.tr,
    genre: this.genre[lang] || this.genre.tr,
    description: this.description[lang] || this.description.tr,
    pages: this.pages,
    language: this.language,
    image: this.image,
    imageType: this.imageType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

const BookMongo = mongoose.model("BookMongo", bookSchema);

module.exports = BookMongo;
