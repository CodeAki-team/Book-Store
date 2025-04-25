'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
}

export default function ProductListPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");

      if (error) {
        console.error("Error fetching books:", error.message);
      } else {
        setBooks(data as Book[]); 
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Books</h1>
      <ul className="space-y-4">
        {books.map((book) => (
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
