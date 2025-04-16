
import { supabase } from "./supabaseClient";

export const getProducts = async (params: URLSearchParams) => {
  let query = supabase.from("books").select("*");

  const categories = params.getAll("category");
  if (categories.length > 0) {
    query = query.in("category", categories);
  }
  

  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice && maxPrice) {
    query = query.gte("price", Number(minPrice)).lte("price", Number(maxPrice));
  }

  const rating = params.get("rating");
  if (rating) {
    query = query.gte("rating", Number(rating));
  }

  if (params.get("inStock") === "true") {
    query = query.eq("in_stock", true);
  }

  const sort = params.get("sort");
  if (sort) {
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    else if (sort === "price-desc")
      query = query.order("price", { ascending: false });
    else if (sort === "newest")
      query = query.order("created_at", { ascending: false });
    else if (sort === "oldest")
      query = query.order("created_at", { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};
