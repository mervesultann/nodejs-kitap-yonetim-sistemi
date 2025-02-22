import Image from "next/image";

export default function BookCard({ book }) {
  const imageUrl = book.image
    ? `data:${book.imageType};base64,${book.image}`
    : "/placeholder-book.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{book.title}</h3>
        <p className="text-gray-600">{book.author}</p>
        <p className="text-sm text-gray-500">{book.genre}</p>
        <div className="mt-2 flex justify-between text-sm">
          <span>{book.pages} sayfa</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {book.language}
          </span>
        </div>
      </div>
    </div>
  );
}
