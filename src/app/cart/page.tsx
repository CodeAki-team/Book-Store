'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Book = {
  id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
};

type CartItem = {
  book_id: number;
  quantity: number;
  book?: Book;
  books?: Book;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const userRes = await supabase.auth.getUser();
        const user = userRes.data?.user;

        if (!user) {
          const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
          if (guestCart.length === 0) {
            setCartItems([]);
            return;
          }

          const bookIds = guestCart.map((item: CartItem) => item.book_id);
          const { data: booksData, error: booksError } = await supabase
            .from('books')
            .select('*')
            .in('id', bookIds);

          if (booksError) throw booksError;

          const merged = guestCart.map((item: CartItem) => {
            const book = booksData.find((b) => b.id === item.book_id);
            return { ...item, book };
          });

          setCartItems(merged);
        } else {
          const { data, error: cartError } = await supabase
            .from('cart')
            .select('*, books(*)')
            .eq('user_id', user.id);

          if (cartError) throw cartError;
          setCartItems(data || []);
        }
      } catch (err: any) {
        console.error('Error loading cart:', err.message);
        setError('Failed to load cart.');
      }
    };

    loadCart();
  }, []);

  const removeItem = async (bookId: number) => {
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;

    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const updated = guestCart.filter((item: CartItem) => item.book_id !== bookId);
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      setCartItems(updated);
    } else {
      await supabase.from('cart').delete().eq('user_id', user.id).eq('book_id', bookId);
      setCartItems(cartItems.filter((item) => item.book_id !== bookId));
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => {
      const book = item.book || item.books;
      if (!book) return sum;
      return sum + book.price * item.quantity;
    }, 0);

  const hasStockError = cartItems.some((item) => {
    const book = item.book || item.books;
    return book ? item.quantity > book.stock : false;
  });

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item, i) => {
                const book = item.book || item.books;
                if (!book) return null;

                const outOfStock = item.quantity > book.stock;

                return (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">${book.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                      ${(book.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {outOfStock ? (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeItem(item.book_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cartItems.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-xl font-bold">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </button>
            <button
              disabled={hasStockError}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
