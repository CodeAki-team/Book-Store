// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// type CartItem = {
//   id: string;
//   title: string;
//   image: string;
//   price: number;
//   quantity: number;
// };

// type LocalCartState = {
//   items: CartItem[];
//   addToLocalCart: (item: CartItem) => void;
//   clearLocalCart: () => void;
// };

// export const useLocalCartStore = create<LocalCartState>()(
//   persist(
//     (set) => ({
//       items: [],
//       addToLocalCart: (item) =>
//         set((state) => {
//           const exists = state.items.find((i) => i.id === item.id);
//           if (exists) return state;
//           return { items: [...state.items, item] };
//         }),
//       clearLocalCart: () => set({ items: [] }),
//     }),
//     {
//       name: 'local-cart', // localStorage key
//     }
//   )
// );
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// type CartItem = {
//   id: string;
//   title: string;
//   image: string;
//   price: number;
//   quantity: number;
// };

// type LocalCartState = {
//   items: CartItem[];
//   addToLocalCart: (item: CartItem) => void;
//   clearLocalCart: () => void;
// };

// export const useLocalCartStore = create<LocalCartState>()(
//   persist(
//     (set) => ({
//       items: [], // مقدار پیش‌فرض یک آرایه خالی است
//       addToLocalCart: (item) =>
//         set((state) => {
//           const exists = state.items.find((i) => i.id === item.id);
//           if (exists) return state;
//           return { items: [...state.items, item] };
//         }),
//       clearLocalCart: () => set({ items: [] }),
//     }),
//     {
//       name: 'local-cart', // localStorage key
//       getStorage: () => localStorage, // مشخص کردن storage که داده‌ها در آن ذخیره شوند
//     }
//   )
// );
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type LocalCartState = {
  items: CartItem[];
  addToLocalCart: (item: CartItem) => void;
  clearLocalCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;  // متد جدید
};

export const useLocalCartStore = create<LocalCartState>()(
  persist(
    (set) => ({
      items: [], // مقدار پیش‌فرض یک آرایه خالی است
      addToLocalCart: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      clearLocalCart: () => set({ items: [] }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return { items: updatedItems };
        }),
    }),
    {
      name: 'local-cart', // localStorage key
    }
  )
);
