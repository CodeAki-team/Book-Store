
import { supabase } from "./supabaseClient";

export const getFilters = async () => {

  const { data: categoryData, error: categoryError } = await supabase
    .from("books")
    .select("category");

  if (categoryError) throw categoryError;

  const categories = [
    ...new Set(categoryData.map((item: any) => item.category)),
  ];


  const { data: statsData, error: statsError } = await supabase
    .from("books")
    .select("price, rating");

  if (statsError) throw statsError;

  const prices = statsData.map((item: any) => item.price);
  const ratings = statsData.map((item: any) => item.rating);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  return {
    categories,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
  };
};
