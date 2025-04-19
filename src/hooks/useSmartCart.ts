import { useSession } from '@supabase/auth-helpers-react';
import { useLocalCartStore } from './useLocalCartStore';
import { addToSupabaseCart } from '@/lib/cart';

export const useSmartCart = () => {
  const session = useSession();
  const { addToLocalCart } = useLocalCartStore();

  const addItem = async (item: any) => {
    if (session?.user) {
      await addToSupabaseCart(session.user.id, item);
    } else {
      addToLocalCart(item);
    }
  };

  return { addItem };
};
