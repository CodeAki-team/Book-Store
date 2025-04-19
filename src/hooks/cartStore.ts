// "use client";
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// type CartItem = {
//   id: string;
//   title: string;
//   image: string;
//   price: number;
//   quantity: number;
//   stock: number;
// };

// type CartState = {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   removeFromCart: (id: string) => void;
// };

// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       cart: [],
//       addToCart: (item) =>
//         set((state) => {
//           const exists = state.cart.find((i) => i.id === item.id);
//           if (exists) return state;
//           return { cart: [...state.cart, item] };
//         }),
//       updateQuantity: (id, quantity) =>
//         set((state) => {
//           if (quantity === 0) {
//             return {
//               cart: state.cart.filter((item) => item.id !== id),
//             };
//           }

//           return {
//             cart: state.cart.map((item) =>
//               item.id === id ? { ...item, quantity } : item
//             ),
//           };
//         }),
//       removeFromCart: (id) =>
//         set((state) => ({
//           cart: state.cart.filter((item) => item.id !== id),
//         })),
//     }),
//     {
//       name: "cart-storage", // اسم کلید در localStorage
//     }
//   )
// );
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

// ------------------- مهمان: localStorage
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

// ------------------- لاگین: Supabase
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
      // optionally: refetch or optimistically update
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
    console.error('Fetch error:', error.message);
    return [];
  }

  return data || [];
};
