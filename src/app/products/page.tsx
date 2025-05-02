import Filters from "@/components/ProductFilter";
import ProductList from "@/components/Productlist";
import Sorting from "@/components/Sorting";
import React from "react";

export const revalidate = 0;

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

async function Productpage({ searchParams }: PageProps) {
  // Await the searchParams since it is a Promise
  const _searchParams = await searchParams;

  const query = new URLSearchParams();

  // Handle filters from URL params
  if (_searchParams.category) {
    const categories = Array.isArray(_searchParams.category)
        ? _searchParams.category
        : [_searchParams.category];
    categories.forEach((cat) => query.append("category", cat));
  }

  if (_searchParams.minPrice) query.set("minPrice", String(_searchParams.minPrice));
  if (_searchParams.maxPrice) query.set("maxPrice", String(_searchParams.maxPrice));
  if (_searchParams.rating) query.set("rating", String(_searchParams.rating));
  if (_searchParams.inStock) query.set("inStock", String(_searchParams.inStock));
  if (_searchParams.sort) query.set("sort", String(_searchParams.sort));

  try {
    // Fetch filters
    const filtersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/filters`,
        { cache: "force-cache" }
    );

    if (!filtersResponse.ok) {
      // Log response status and throw an error if not OK
      console.error("Failed to fetch filters:", filtersResponse.statusText);
      throw new Error("Failed to fetch filters");
    }

    const filters = await filtersResponse.json();

    // Fetch products based on the constructed query
    const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products?${query.toString()}`,
        {
          next: { tags: ['products'] },
        }
    );

    if (!productsResponse.ok) {
      // Log response status and throw an error if not OK
      console.error("Failed to fetch products:", productsResponse.statusText);
      throw new Error("Failed to fetch products");
    }

    const products: Product[] = await productsResponse.json();

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
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
        <div className="text-center py-10 text-muted-foreground">
          There was an error fetching data. Please try again later.
        </div>
    );
  }
}

export default Productpage;
