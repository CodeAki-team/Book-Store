import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    book_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

interface LocalCartState {
    items: CartItem[];
    addToLocalCart: (item: CartItem) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearLocalCart: () => void;
}

export const useLocalCartStore = create<LocalCartState>()(
    persist(
        (set, get) => ({
            items: [], 
            addToLocalCart: (item: CartItem) => {
                console.log('Current cart items:', get().items);  
                const existing = get().items.find((i) => i.book_id === item.book_id);
                console.log('Existing item:', existing);  
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.book_id === item.book_id
                                ? {...i, quantity: i.quantity + item.quantity}
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
                console.log('Updated cart items:', get().items); 
            },
            updateQuantity: (book_id, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.book_id === book_id ? { ...item, quantity } : item
                    ),
                });
            },
            clearLocalCart: () => set({ items: [] }), 
        }),
        {
            name: 'guest-cart', 
        }
    )
);
