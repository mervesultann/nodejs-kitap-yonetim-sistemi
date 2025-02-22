"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";

export default function BookForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title_tr: "",
    title_en: "",
    author_tr: "",
    author_en: "",
    genre_tr: "",
    genre_en: "",
    description_tr: "",
    description_en: "",
    pages: "",
    language: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          form.append(key, formData[key]);
        }
      });

      const response = await fetch("http://localhost:3000/bookmongo", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Kitap eklenirken bir hata oluştu");
      }

      router.push("/book");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Yeni Kitap Ekle</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Başlık (Türkçe)
              </label>
              <input
                type="text"
                value={formData.title_tr}
                onChange={(e) =>
                  setFormData({ ...formData, title_tr: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Başlık (İngilizce)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) =>
                  setFormData({ ...formData, title_en: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Yazar (Türkçe)
              </label>
              <input
                type="text"
                value={formData.author_tr}
                onChange={(e) =>
                  setFormData({ ...formData, author_tr: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Yazar (İngilizce)
              </label>
              <input
                type="text"
                value={formData.author_en}
                onChange={(e) =>
                  setFormData({ ...formData, author_en: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tür (Türkçe)
              </label>
              <input
                type="text"
                value={formData.genre_tr}
                onChange={(e) =>
                  setFormData({ ...formData, genre_tr: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tür (İngilizce)
              </label>
              <input
                type="text"
                value={formData.genre_en}
                onChange={(e) =>
                  setFormData({ ...formData, genre_en: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Açıklama (Türkçe)
              </label>
              <textarea
                value={formData.description_tr}
                onChange={(e) =>
                  setFormData({ ...formData, description_tr: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                rows="3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Açıklama (İngilizce)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) =>
                  setFormData({ ...formData, pages: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Kitabın Dili
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Türkçe">Türkçe</option>
                <option value="İngilizce">İngilizce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Kitap Kapağı
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? "Ekleniyor..." : "Kitap Ekle"}
          </button>
        </form>
      </div>
    </div>
  );
}
