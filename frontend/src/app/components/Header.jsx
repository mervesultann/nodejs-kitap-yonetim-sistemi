import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-800 text-white mb-8">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex gap-6">
          <li>
            <Link href="/books" className="hover:text-blue-400">
              Kitaplar
            </Link>
          </li>
          <li>
            <Link href="/books/add" className="hover:text-blue-400">
              Yeni Kitap Ekle
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}