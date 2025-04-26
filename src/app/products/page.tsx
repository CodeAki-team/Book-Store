import Filters from "@/components/ProductFilter";
import ProductList from "@/components/Productlist";
import Sorting from "@/components/Sorting";
import React from "react";
import { headers } from "next/headers";

export const dynamic = "force-static";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function ProductPage({ searchParams }: { searchParams: PageProps["searchParams"] }) {
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? "https"; // Default to https
  const host = headersList.get("host");
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Base URL is not defined. Please check your environment variables or request headers.");
  }

  const _searchParams = await searchParams;
  const query = new URLSearchParams();

  // Handle filters from URL params
  if (_searchParams?.category) {
    const categories = Array.isArray(_searchParams.category)
        ? _searchParams.category
        : [_searchParams.category];
    categories.forEach((cat) => query.append("category", cat));
  }

  if (_searchParams?.minPrice) query.set("minPrice", String(_searchParams.minPrice));
  if (_searchParams?.maxPrice) query.set("maxPrice", String(_searchParams.maxPrice));
  if (_searchParams?.rating) query.set("rating", String(_searchParams.rating));
  if (_searchParams?.inStock) query.set("inStock", String(_searchParams.inStock));
  if (_searchParams?.sort) query.set("sort", String(_searchParams.sort));

  // Fetch filters
  let filters = [];
  try {
    const res = await fetch(`${baseUrl}/api/filters`, {
      cache: "force-cache",
    });

    if (res.ok) {
      filters = await res.json();
    } else {
      console.error("Failed to fetch filters:", res.statusText);
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
  }

  // Fetch products
  let products: Product[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products?${query.toString()}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      products = await res.json();
    } else {
      console.error("Failed to fetch products:", res.statusText);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
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
