'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`https://qgctoqjyvnmsbjnbhplo.supabase.co/rest/v1/books?id=eq.${id}`, {
        headers: {
   
        },
      });
      const data = await res.json();
      setBook(data[0]);
    };
    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(`https://qgctoqjyvnmsbjnbhplo.supabase.co/rest/v1/books?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    if (!res.ok) {
      setError('Update failed.');
      return;
    }
    router.push('/admin/products');
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Edit Book</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input className="w-full p-2 border" value={book.title} onChange={e => setBook({ ...book, title: e.target.value })} />
      <input className="w-full p-2 border" value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} />
      <input className="w-full p-2 border" value={book.price} onChange={e => setBook({ ...book, price: e.target.value })} />
      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </div>
  );
}
