

'use client';
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';




export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState({
    title: '',
    author: '',
    category:'',
    price: '',
    rating:'',
    stock: '', 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
    
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Failed to fetch book.');
        console.error(error);
      } else {
        setBook(data);
      }
    };
    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    
    const { error } = await supabase
      .from('books')
      .update({
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock, 
      })
      .eq('id', id);

    if (error) {
      setError('Update failed.');
      console.error(error);
      return;
    }

    router.push('/admin/products');
  };

  if (!book.title) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Edit Book</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input 
            type="text"
            className="w-full p-2 border"
            value={book.title}
            onChange={e => setBook({ ...book, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Author</label>
          <input 
            type="text"
            className="w-full p-2 border"
            value={book.author}
            onChange={e => setBook({ ...book, author: e.target.value })}
          />
        </div>
        <div>
          <label className="block">category</label>
          <input 
            type="text"
            className="w-full p-2 border"
            value={book.category}
            onChange={e => setBook({ ...book, category: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Price</label>
          <input 
            type="number"
            className="w-full p-2 border"
            value={book.price}
            onChange={e => setBook({ ...book, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block">Stock</label>
          <input 
            type="number"
            className="w-full p-2 border"
            value={book.stock}
            onChange={e => setBook({ ...book, stock: e.target.value })}
          />
        </div>
        <div>
          <label className="block">rating</label>
          <input 
            type="number"
            className="w-full p-2 border"
            value={book.rating}
            onChange={e => setBook({ ...book, rating: e.target.value })}
          />
        </div>
        <button 
          type="button"
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
