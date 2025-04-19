'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLocalCartStore, useSupabaseCartStore } from '@/hooks/cartStore';

const CartSyncProvider = () => {
  const localCart = useLocalCartStore();
  const supaCart = useSupabaseCartStore();

  useEffect(() => {
    const syncAndLoad = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      const user = session?.user;

      if (user) {
        if (localCart.items.length > 0) {
          await Promise.all(
            localCart.items.map((item) =>
              supaCart.addItem(item.book_id, item.quantity)
            )
          );
          localCart.clearCart();
        }

        const { data, error } = await supabase
          .from('cart')
          .select('book_id, quantity')
          .eq('user_id', user.id);

        if (!error && data) {
          supaCart.setItems(data);
        }
      } else {
        supaCart.setItems([]);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncAndLoad();
      } else {
        supaCart.setItems([]);
      }
    });

    // حذف syncAndLoad از اینجا 👇 چون بالا انجام میشه بعد از auth
    // syncAndLoad();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [localCart.items]);

  return null;
};

export default CartSyncProvider;
