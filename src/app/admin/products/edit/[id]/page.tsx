// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// export default function EditProductPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [book, setBook] = useState<any>(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBook = async () => {
//       const res = await fetch(`https://qgctoqjyvnmsbjnbhplo.supabase.co/rest/v1/books?id=eq.${id}`, {
//         headers: {
   
//         },
//       });
//       console.log(res)
//       const data = await res.json();
//       setBook(data[0]);
//     };
//     fetchBook();
//   }, [id]);

//   const handleUpdate = async () => {
//     const res = await fetch(`https://qgctoqjyvnmsbjnbhplo.supabase.co/rest/v1/books?id=eq.${id}`, {
//       method: 'PATCH',
//       headers: {
 
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(book),
//     });
//     if (!res.ok) {
//       setError('Update failed.');
//       return;
//     }
//     router.push('/admin/products');
//   };

//   if (!book) return <p>Loading...</p>;

//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-bold">Edit Book</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <input className="w-full p-2 border" value={book.title} onChange={e => setBook({ ...book, title: e.target.value })} />
//       <input className="w-full p-2 border" value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} />
//       <input className="w-full p-2 border" value={book.price} onChange={e => setBook({ ...book, price: e.target.value })} />
//       <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
//     </div>
//   );
// }

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
    price: '',
    stock: '', // اضافه کردن stock به وضعیت کتاب
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      // استفاده از supabase برای گرفتن داده‌ها از جدول books
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
    // استفاده از supabase برای به‌روزرسانی کتاب
    const { error } = await supabase
      .from('books')
      .update({
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock, // ارسال مقدار stock
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
