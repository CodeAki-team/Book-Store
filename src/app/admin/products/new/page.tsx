'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient'; // حواست باشه مسیر درست باشه

export default function AddBookPage() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    rating: '',
    description: '',
    image: null as File | null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
  
  };

  const validateForm = () => {
    if (!form.title || !form.author || !form.price || !form.stock || !form.rating || !form.description || !form.image) {
      setError('All fields are required.');
      return false;
    }
    if (isNaN(Number(form.price)) || isNaN(Number(form.stock)) || isNaN(Number(form.rating))) {
      setError('Price, Stock, and Rating must be valid numbers.');
      return false;
    }
    if (Number(form.rating) < 0 || Number(form.rating) > 5) {
      setError('Rating must be between 0 and 5.');
      return false;
    }
    return true;
  };
  console.log(form.image)
  const handleSubmit = async () => {
    setError('');
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const fileExt = form.image!.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `image/${fileName}`;
  
      // 1. Upload image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('books-image')
        .upload(filePath, form.image!);
  
      if (uploadError){
        console.log('uploadError', uploadError);

        
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      const { data: publicData } = supabase.storage
        .from('books-image')
        .getPublicUrl(filePath);
  
      const publicUrl = publicData?.publicUrl;
  
      // 2. Insert book with Supabase SDK
      const { error: insertError } = await supabase
        .from('books')
        .insert({
          title: form.title,
          author: form.author,
          price: Number(form.price),
          stock: Number(form.stock),
          rating: Number(form.rating),
          description: form.description,
          image: publicUrl,
        });
  
      if (insertError) throw new Error(`Book insert failed: ${insertError.message}`);
  
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold mb-4">Add New Book</h1>

          {error && <p className="text-red-600">{error}</p>}

          <Input name="title" placeholder="Title" onChange={handleChange} />
          <Input name="author" placeholder="Author" onChange={handleChange} />
          <Input name="price" placeholder="Price" onChange={handleChange} />
          <Input name="stock" placeholder="Stock" onChange={handleChange} />
          <Input name="rating" placeholder="Rating (0-5)" onChange={handleChange} />
          <Textarea name="description" placeholder="Description" onChange={handleChange} />
          <Input type="file" accept="image/*" onChange={handleFileChange} />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
