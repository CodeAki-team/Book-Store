'use client';
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    rating: '',
    stock: '',
    image: ''
  });

  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let imageUrl = book.image;

    try {
      if (imageFile) {
        const uniqueFileName = `${Date.now()}-${imageFile.name}`;
        const filePath = `images/${id}/${uniqueFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('books-image')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Image upload failed.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('books-image')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        } else {
          throw new Error('Failed to get public image URL.');
        }
      }

      const updatedBook = {
        title: book.title,
        author: book.author,
        price: Number(book.price),
        stock: Number(book.stock),
        category: book.category,
        rating: Number(book.rating),
        image: imageUrl
      };

      const { error: updateError } = await supabase
        .from('books')
        .update(updatedBook)
        .eq('id', id);

      if (updateError) {
        throw new Error('Update failed.');
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!book.title) return <p>Loading...</p>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold">Edit Book</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form className="space-y-4" onSubmit={handleUpdate}>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={book.title}
            onChange={e => setBook({ ...book, title: e.target.value })}
          />
        </div>

        <div>
          <Label>Author</Label>
          <Input
            type="text"
            value={book.author}
            onChange={e => setBook({ ...book, author: e.target.value })}
          />
        </div>

        <div>
          <Label>Category</Label>
          <Input
            type="text"
            value={book.category}
            onChange={e => setBook({ ...book, category: e.target.value })}
          />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={book.price}
            onChange={e => setBook({ ...book, price: e.target.value })}
          />
        </div>

        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={book.stock}
            onChange={e => setBook({ ...book, stock: e.target.value })}
          />
        </div>

        <div>
          <Label>Rating</Label>
          <Input
            type="number"
            value={book.rating}
            onChange={e => setBook({ ...book, rating: e.target.value })}
          />
        </div>

        <div>
          <Label>Current Image</Label>
          {book.image ? (
            <img
              src={book.image}
              alt="Product Image"
              className="w-32 h-32 object-cover rounded-md"
            />
          ) : (
            <p>No image available</p>
          )}
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Edit Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2"
          >
            {loading ? 'Updating...' : 'Update Book'}
          </Button>
        </div>
      </form>
    </div>
  );
}
