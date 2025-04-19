import { supabase } from "@/lib/supabaseClient";

export const addToSupabaseCart = async (userId: string, item: any) => {
  const { error } = await supabase.from('cart').insert({
    user_id: userId,
    book_id: item.id,
    quantity: item.quantity,
    added_at: new Date(),
    updated_at: new Date(),
  });
  if (error) throw error;
};

export const syncLocalToSupabase = async (userId: string, items: any[]) => {
  const payload = items.map((item) => ({
    user_id: userId,
    book_id: item.id,
    quantity: item.quantity,
    added_at: new Date(),
    updated_at: new Date(),
  }));

  const { error } = await supabase.from('cart').insert(payload);
  if (error) throw error;
};
