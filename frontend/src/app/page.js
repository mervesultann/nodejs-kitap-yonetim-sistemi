import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="text-4xl font-bold mb-8">Kitap Yönetim Sistemi</h1>
        <div className="space-x-4">
          <Link 
            href="/books" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Kitapları Görüntüle
          </Link>
          <Link 
            href="/books/add" 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Yeni Kitap Ekle
          </Link>
        </div>
      </div>
    </>
  );
}