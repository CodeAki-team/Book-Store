'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [cartId, setCartId] = useState<string | null>(null); 


    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const { data, error } = await supabase
                    .from("cart")
                    .select("id, quantity, books(title, image, price)") 
                    .eq("id", "1"); 

                if (error) {
                    console.error("Error fetching cart items:", error);
                    setError(error.message);
                } else {
                    setCartItems(data);
                    if (data.length > 0) {
                        setCartId(data[0].id); 
                    }
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error fetching cart items:", err.message);
                    setError(err.message);
                } else {
                    console.error("Unknown error occurred");
                    setError("An unknown error occurred");
                }
            }
        };

        fetchCartItems();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Your Cart</h1>

            
            {cartId && (
                <div className="text-center mb-6">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-medium">
                        Cart ID: {cartId}
                    </span>
                </div>
            )}
            
            {error && (
                <div className="bg-red-200 text-red-800 p-4 rounded-md mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Image</th>
                        <th className="px-6 py-3 text-left">Title</th>
                        <th className="px-6 py-3 text-left">Price</th>
                        <th className="px-6 py-3 text-left">Quantity</th>
                        <th className="px-6 py-3 text-left">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => {
                            const { title, image, price } = item.books;
                            const totalPrice = price * item.quantity;

                            return (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img
                                            src={image}
                                            alt={title}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{title}</td>
                                    <td className="px-6 py-4">${price}</td>
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4">${totalPrice}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-lg text-gray-600">
                                Your cart is empty.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none">
                    Continue Shopping
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
