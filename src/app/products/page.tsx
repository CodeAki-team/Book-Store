import Filters from "@/components/ProductFilter";
import ProductList from "@/components/Productlist";
import Sorting from "@/components/Sorting";
import React from "react";

export const dynamic = "force-static";

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
  stock: number;
}

async function Productpage({ searchParams }: PageProps) {
  const query = new URLSearchParams();

  // Handle filters from URL params
  if (searchParams.category) {
    const categories = Array.isArray(searchParams.category)
        ? searchParams.category
        : [searchParams.category];
    categories.forEach((cat) => query.append("category", cat));
  }

  if (searchParams.minPrice) query.set("minPrice", String(searchParams.minPrice));
  if (searchParams.maxPrice) query.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams.rating) query.set("rating", String(searchParams.rating));
  if (searchParams.inStock) query.set("inStock", String(searchParams.inStock));
  if (searchParams.sort) query.set("sort", String(searchParams.sort));

  // Fetch filters
  const filters = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/filters`, {
    cache: "force-cache",
  }).then((res) => res.json());

  // Fetch filtered products
  const products: Product[] = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products?${query.toString()}`,
      {
        next: { revalidate: 60 },
      }
  ).then((res) => res.json());

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

          {products.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No products found with the selected filters.
              </div>
          ) : (
              <ProductList products={products} />
          )}
        </main>
      </div>
  );
}

export default Productpage;
