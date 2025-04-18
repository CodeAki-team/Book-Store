import Filters from "@/components/ProductFilter";
import ProductList from "@/components/Productlist";
import Sorting from "@/components/Sorting";
import React from "react";
export const dynamic = "forced-static";
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  category: string;
}

async function Productpage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = new URLSearchParams();

  const categories = resolvedSearchParams.category;
  if (categories) {
    if (Array.isArray(categories)) {
      categories.forEach((c) => query.append("category", c));
    } else {
      query.append("category", categories);
    }
  }

  if (resolvedSearchParams.minPrice)
    query.set("minPrice", String(resolvedSearchParams.minPrice));
  if (resolvedSearchParams.maxPrice)
    query.set("maxPrice", String(resolvedSearchParams.maxPrice));
  if (resolvedSearchParams.rating)
    query.set("rating", String(resolvedSearchParams.rating));
  if (resolvedSearchParams.inStock)
    query.set("inStock", String(resolvedSearchParams.inStock));
  if (resolvedSearchParams.sort)
    query.set("sort", String(resolvedSearchParams.sort));
  const filters = await fetch(`http://localhost:3000/api/filters`, {
    cache: "force-cache",
  }).then((res) => res.json());

  const products: Product[] = await fetch(
    `http://localhost:3000/api/products?${query.toString()}`,
    {
      next: { revalidate: 60 },
    }
  ).then((res) => res.json());

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
        <main className="flex flex-col container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">
            Products
          </h1>
          <div className="flex justify-between items-center mb-8">
            <Filters filters={filters} />
            <Sorting />
          </div>

          <div className="text-center py-10 text-muted-foreground">
            No products found with the selected filters.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <main className="flex flex-col container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">
          Products
        </h1>
        <div className="flex justify-between items-center mb-8">
          <Filters filters={filters} />
          <Sorting />
        </div>

        <ProductList products={products} />
      </main>
    </div>
  );
}

export default Productpage;
