import { useState } from 'react';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { useSmartCart } from '@/hooks/useSmartCart';
import { supabase } from '@/lib/supabaseClient';
import { useLocalCartStore } from '@/hooks/useLocalCartStore';

type Props = {
    product: {
        id: string;
        title: string;
        image: string;
        price: number;
        stock: number;
    };
};

const AddCartBtn = ({ product }: Props) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { items, updateQuantity, addToLocalCart } = useLocalCartStore();
    const item = items.find((i) => i.book_id === product.id);
    const { addItem: addSmartCartItem } = useSmartCart();

    const addToSupabase = async (productId: string, quantity: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
            const { error } = await supabase
                .from('cart')
                .upsert([
                    {
                        user_id: user.id,
                        book_id: productId,
                        quantity: quantity,
                    }
                ], {
                    onConflict: 'user_id,book_id'
                });

            if (error) {
                console.error("Error adding to cart in Supabase:", error.message);
            }
        }
    };

    const handleAdd = () => {
        const cartItem = {
            id: product.id,
            book_id: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image,
        };

        if (!item) {
            addToLocalCart(cartItem);
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = [...currentCart, cartItem];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }

        addToSupabase(product.id, quantity);
        setIsAdding(true);
    };

    const handleUpdate = () => {
        if (item) {
            updateQuantity(item.book_id, quantity);
            addToSupabase(product.id, quantity);
        }
        setIsAdding(false);
    };

    const increment = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (product.stock === 0) {
        return (
            <Button
                className="w-full mt-4 bg-gray-400 text-gray-700 font-semibold py-3 rounded-md transition-colors duration-300 ease-in-out cursor-not-allowed"
                disabled
            >
                Out of Stock
            </Button>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {isAdding && (
                <div className="flex items-center gap-2 transition-all duration-300 ease-in-out opacity-100">
                    <Button
                        onClick={decrement}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                        -
                    </Button>
                    <span className="px-2 text-lg font-semibold">{quantity}</span>
                    <Button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className={`px-3 py-1 rounded-md transition-all duration-300 ease-in-out cursor-pointer ${
                            quantity >= product.stock
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        +
                    </Button>
                </div>
            )}

            {!isAdding ? (
                <Button
                    onClick={handleAdd}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition-colors duration-300 ease-in-out cursor-pointer"
                >
                    <ShoppingCart className="mr-2" /> Add to Cart
                </Button>
            ) : (
                <Button
                    onClick={handleUpdate}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition-colors duration-300 ease-in-out cursor-pointer"
                >
                    <ShoppingCart className="mr-2" /> Update Cart
                </Button>
            )}
        </div>
    );
};

export default AddCartBtn;
