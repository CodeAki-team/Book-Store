"use client";
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

    const addItemToCart = async (bookId: number, quantity: number) => {
        try {
            const userRes = await supabase.auth.getUser();
            const user = userRes.data?.user;

            if (!user) {
                const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
                const existingItem = guestCart.find((item: CartItem) => item.book_id === bookId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    guestCart.push({ book_id: bookId, quantity });
                }

                localStorage.setItem('guest_cart', JSON.stringify(guestCart));
                setCartItems(guestCart);
            } else {
                const { data, error } = await supabase
                    .from('cart')
                    .upsert({ user_id: user.id, book_id: bookId, quantity });

                if (error) {
                    setError('Failed to add item to your cart.');
                    console.error('Error adding item to cart:', error);
                    return;
                }

                const { data: updatedCart, error: fetchError } = await supabase
                    .from('cart')
                    .select('*, books(*)')
                    .eq('user_id', user.id);

                if (fetchError) {
                    setError('Failed to load updated cart.');
                    console.error('Error fetching updated cart data:', fetchError);
                    return;
                }

                setCartItems(updatedCart || []);
            }
        } catch (err) {
            console.error('Error adding item to cart:', err);
            setError('Failed to add item to the cart.');
        }
    };

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

                    if (booksError) {
                        setError('Failed to load books from the database.');
                        console.error('Error fetching books:', booksError);
                        return;
                    }

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

                    if (cartError) {
                        setError('Failed to load your cart.');
                        console.error('Error fetching cart data:', cartError);
                        return;
                    }
                    setCartItems(data || []);
                }
            } catch (err: any) {
                console.error('Error loading cart:', err.message);
                setError('Failed to load cart.');
            }
        };

        loadCart().catch((err) => {
            console.error('Error in loadCart promise:', err);
        });
    }, []);

    const removeItem = async (bookId: number) => {
        try {
            const userRes = await supabase.auth.getUser();
            const user = userRes.data?.user;

            if (!user) {
                const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
                const updated = guestCart.filter((item: CartItem) => item.book_id !== bookId);
                localStorage.setItem('guest_cart', JSON.stringify(updated));
                setCartItems(updated);
            } else {
                const { error } = await supabase.from('cart').delete().eq('user_id', user.id).eq('book_id', bookId);
                if (error) {
                    setError('Failed to remove item from your cart.');
                    console.error('Error removing item from cart:', error);
                    return;
                }
                setCartItems(cartItems.filter((item) => item.book_id !== bookId));
            }
        } catch (err) {
            console.error('Error removing item:', err);
            setError('Failed to remove item.');
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
                        cartItems.map((item) => {
                            const book = item.book || item.books;
                            if (!book) return null;

                            const outOfStock = item.quantity > book.stock;

                            return (
                                <tr key={item.book_id} className="border-b hover:bg-gray-50">
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
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
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
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                            Continue Shopping
                        </button>
                        <button
                            disabled={hasStockError}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
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
