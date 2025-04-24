import { useSession } from '@supabase/auth-helpers-react';
import { useLocalCartStore } from './useLocalCartStore';
import { addToSupabaseCart } from '@/lib/cart';

interface CartItem {
    id: string;
    book_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export const useSmartCart = () => {
    const session = useSession();
    const { addToLocalCart } = useLocalCartStore();

    
    const addItem = async (item: CartItem) => {
        console.log('Adding item:', item);  
        if (session?.user) {
            await addToSupabaseCart(session.user.id, item);
        } else {
            console.log('Adding to local cart (guest)', item);  
            addToLocalCart(item);
        }
    };


    return { addItem };
};
