"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import BookCard from "@/app/components/BookCard";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState("tr");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/bookmongo?lang=${currentLang}`
        );
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentLang]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}
