import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNotification } from '@/components/Context/NotificationContext';
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
    className?: string;
};

const AddCartBtn = ({ product, className }: Props) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { items, updateQuantity } = useLocalCartStore();
    const { notify } = useNotification();

    const addToSupabase = async (productId: string, quantity: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
            const { error } = await supabase
                .from('cart')
                .upsert(
                    [
                        {
                            user_id: user.id,
                            book_id: productId,
                            quantity: quantity,
                        }
                    ],
                    {
                        onConflict: 'user_id,book_id'
                    }
                );

            if (error) {
                console.error("Error adding to cart in Supabase:", error.message);
                notify(`Failed to update cart: ${error.message}`, 'error');
            }
        }
    };

    const handleAddOrUpdate = () => {
        if (!product) {
            notify("Product information is missing", 'error');
            return;
        }

        const cartItem = {
            id: product.id,
            book_id: product.id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image,
        };

        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingCartItem = currentCart.find((item: any) => item.book_id === product.id);

        if (!existingCartItem) {
            currentCart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            addToSupabase(product.id, quantity);
            notify(`${product.title} added to cart!`, 'success');
        } else {
            const updatedCart = currentCart.map((item: any) =>
                item.book_id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            addToSupabase(product.id, existingCartItem.quantity + quantity);
            notify(`${product.title} updated in cart!`, 'info');
        }

        setIsAdding(true);
    };

    const increment = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (!product || product.stock === 0) {
        return (
            <Button
                className={`w-full mt-4 bg-gray-400 text-gray-700 font-semibold py-3 rounded-md transition-colors duration-300 ease-in-out cursor-not-allowed ${className}`}
                disabled
            >
                Out of Stock
            </Button>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
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
                    onClick={handleAddOrUpdate}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ease-in-out cursor-pointer text-lg"
                >
                    <ShoppingCart className="mr-2" /> Add to Cart
                </Button>
            ) : (
                <Button
                    onClick={handleAddOrUpdate}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ease-in-out cursor-pointer text-lg"
                >
                    <ShoppingCart className="mr-2" /> Update Cart
                </Button>
            )}
        </div>
    );
};

export default AddCartBtn;
