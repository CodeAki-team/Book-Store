import { supabase } from '@/lib/supabaseClient';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
    book_id: string;
    quantity: number;
};

interface CartStore {
    items: CartItem[];
    addItem: (book_id: string, quantity?: number) => void;
    setItems: (items: CartItem[]) => void;
    clearCart: () => void;
}

export const useLocalCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (book_id, quantity = 1) => {
                const existing = get().items.find(item => item.book_id === book_id);
                if (existing) {
                    set({
                        items: get().items.map(item =>
                            item.book_id === book_id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    set({ items: [...get().items, { book_id, quantity }] });
                }
            },
            setItems: (items) => set({ items }),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'guest-cart',
        }
    )
);

export const useSupabaseCartStore = create<CartStore>()((set, get) => ({
    items: [],
    addItem: async (book_id, quantity = 1) => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        const { data, error } = await supabase
            .from('cart')
            .upsert([{ user_id: user.id, book_id, quantity }], {
                onConflict: 'user_id,book_id',
            });

        if (error) {
            console.error('Error updating Supabase cart:', error.message);
        } else {
            get().setItems(await fetchUserCart(user.id));
        }
    },
    setItems: (items) => set({ items }),
    clearCart: async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;

        await supabase.from('cart').delete().eq('user_id', user.id);
        set({ items: [] });
    },
}));

const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
    const { data, error } = await supabase
        .from('cart')
        .select('book_id, quantity')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching cart from Supabase:', error.message);
        return [];
    }

    return data || [];
};
