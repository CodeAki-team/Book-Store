import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLocalCartStore } from '@/hooks/useLocalCartStore';

const AuthCartSync = () => {
    const { items, addToLocalCart } = useLocalCartStore();

    useEffect(() => {
        const fetchCartFromSupabase = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const userId = session.user.id;

                const { data: cartItems, error } = await supabase
                    .from('cart')
                    .select('*')
                    .eq('user_id', userId);

                if (error) {
                    console.error('Error fetching cart from Supabase:', error.message);
                } else {
                    cartItems?.forEach((cartItem) => {
                        addToLocalCart({
                            id: cartItem.id, 
                            book_id: cartItem.book_id,
                            title: cartItem.book_title,
                            image: cartItem.book_image,
                            price: cartItem.book_price,
                            quantity: cartItem.quantity,
                        });
                    });
                }
            }
        };

        fetchCartFromSupabase();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchCartFromSupabase();
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [addToLocalCart]);

    return null;
};

export default AuthCartSync;
