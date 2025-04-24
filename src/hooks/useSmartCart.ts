
import { useLocalCartStore } from './useLocalCartStore';
import { addToSupabaseCart } from '@/lib/cart';
import { useUser } from './useUser';

interface CartItem {
    id: string;
    book_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export const useSmartCart = () => {
   const user=useUser()
    const { addToLocalCart } = useLocalCartStore();

    
    const addItem = async (item: CartItem) => {
        console.log('Adding item:', item);  
        if (user) {
            await addToSupabaseCart(user.id, item);
        } else {
            console.log('Adding to local cart (guest)', item);  
            addToLocalCart(item);
        }
    };


    return { addItem };
};
