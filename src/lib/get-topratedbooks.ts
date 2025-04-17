import { supabase } from "./supabaseClient";

export const getTopRatedBooks = async (limit: number = 6) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
};
