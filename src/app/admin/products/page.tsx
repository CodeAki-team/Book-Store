'use client';

import { useEffect, useState } from 'react';

export default function ProductListPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('https://qgctoqjyvnmsbjnbhplo.supabase.co/rest/v1/books', {
        headers: {
     
        },
      });
      const data = await res.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Books</h1>
      <ul className="space-y-4">
        {books.map((book: any) => (
          <li key={book.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <p>Stock: {book.stock}</p>
            <a
              href={`/admin/products/edit/${book.id}`}
              className="text-blue-600 underline"
            >
              Edit
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
