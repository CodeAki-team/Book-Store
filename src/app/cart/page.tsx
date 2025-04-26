"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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
};

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCartData = async () => {
            try {
                const userRes = await supabase.auth.getUser();
                const user = userRes.data?.user;

                let cartData: CartItem[] = [];

                if (!user) {
                    const guestCartRaw = localStorage.getItem("cart");
                    let guestCart: CartItem[] = [];

                    try {
                        guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];
                    } catch {
                        guestCart = [];
                        localStorage.removeItem("cart");
                    }

                    const uniqueMap = new Map<number, CartItem>();
                    guestCart.forEach((item) => {
                        if (uniqueMap.has(item.book_id)) {
                            uniqueMap.get(item.book_id)!.quantity += item.quantity;
                        } else {
                            uniqueMap.set(item.book_id, { ...item });
                        }
                    });

                    cartData = Array.from(uniqueMap.values());
                    localStorage.setItem("cart", JSON.stringify(cartData));
                } else {
                    const { data, error: cartError } = await supabase
                        .from("cart")
                        .select("book_id, quantity")
                        .eq("user_id", user.id);

                    if (cartError) {
                        setError("Failed to load your cart.");
                        console.error("Error fetching cart data:", cartError);
                        return;
                    }

                    cartData = data || [];
                }

                const { data: booksData, error: booksError } = await supabase
                    .from("books")
                    .select("id, title, image, price, stock");

                if (booksError) {
                    setError("Failed to load book data.");
                    console.error("Error fetching books:", booksError);
                    return;
                }

                setBooks(booksData || []);

                const cartItemsWithBooks = cartData.map((item) => {
                    const book = booksData?.find((b) => b.id === item.book_id);
                    return { ...item, book };
                });

                setCartItems(cartItemsWithBooks);
            } catch (err: any) {
                console.error("Error loading cart:", err.message);
                setError("Failed to load cart.");
            }
        };

        loadCartData();
    }, []);

    const removeItem = async (bookId: number) => {
        try {
            const userRes = await supabase.auth.getUser();
            const user = userRes.data?.user;

            if (!user) {
                const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
                const updated = guestCart.filter((item: CartItem) => item.book_id !== bookId);
                localStorage.setItem("cart", JSON.stringify(updated));
                setCartItems(
                    updated.map((item: CartItem) => ({
                        ...item,
                        book: books.find((b) => b.id === item.book_id),
                    }))
                );
            } else {
                const { error } = await supabase
                    .from("cart")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("book_id", bookId);

                if (error) {
                    setError("Failed to remove item from your cart.");
                    console.error("Error removing item from cart:", error);
                    return;
                }

                const updatedCart = cartItems.filter((item) => item.book_id !== bookId);
                setCartItems(updatedCart);
            }
        } catch (err) {
            console.error("Error removing item:", err);
            setError("Failed to remove item.");
        }
    };

    const calculateTotal = () =>
        cartItems.reduce((sum, item) => {
            const book = item.book;
            if (!book) return sum;
            return sum + book.price * item.quantity;
        }, 0);

    const hasStockError = cartItems.some((item) => {
        const book = item.book;
        return book ? item.quantity > book.stock : false;
    });

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Your Cart</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-4">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => {
                        const book = item.book;
                        if (!book) return null;

                        const outOfStock = item.quantity > book.stock;

                        return (
                            <div
                                key={item.book_id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                            >
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-24 h-24 object-cover rounded-md self-center sm:self-start"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-center sm:text-left">
                                        {book.title}
                                    </h2>
                                    <p className="text-gray-600 text-center sm:text-left">
                                        Price: ${book.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-600 text-center sm:text-left">
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="text-gray-800 font-semibold text-center sm:text-left mt-1">
                                        Total: ${(book.price * item.quantity).toFixed(2)}
                                    </p>
                                    <div className="mt-2 flex justify-center sm:justify-start">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                outOfStock
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-500 text-white"
                                            }`}
                                        >
                                            {outOfStock ? "Out of Stock" : "In Stock"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-center sm:justify-end">
                                    <button
                                        onClick={() => removeItem(item.book_id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-xl font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
                        <Link href="/products" className="w-full sm:w-auto">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full cursor-pointer">
                                Continue Shopping
                            </button>
                        </Link>

                        <button
                            disabled={hasStockError}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto cursor-pointer"
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
