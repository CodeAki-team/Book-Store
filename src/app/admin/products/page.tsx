'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'; // شادکن
import { Button } from '@/components/ui/button'; // شادکن

import { Trash } from 'lucide-react'; // آیکون حذف از Lucide
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  image: string;
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

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting book:", error.message);
    } else {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="bg-white shadow-lg rounded-lg">
            <CardHeader>
              <img
                src={book.image || '/default-image.jpg'}
                alt={book.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-800">Price: ${book.price}</p>
              <p className="text-gray-800">Stock: {book.stock}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <Link href={`/admin/products/edit/${book.id}`}><Button
                
                className=" p-5 hover:underline"
              >
                Edit
              </Button></Link>
              {/* دکمه حذف */}
              <Button
                variant="destructive"
                onClick={() => handleDelete(book.id)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Trash className="w-5 h-5" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
