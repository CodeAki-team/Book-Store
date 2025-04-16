import Filters from "@/components/ProductFilter";
import Sorting from "@/components/Sorting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFilters } from "@/lib/get-filters";
import { getProducts } from "@/lib/get-products";
import { ShoppingCart } from "lucide-react";
import React from "react";

async function Productpage({ searchParams }: { searchParams: any }) {
  const filters = await getFilters();
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => [key, String(value)])
    )
  );
  const categories = searchParams.category;
  if (categories) {
    if (Array.isArray(categories)) {
      categories.forEach((c) => query.append("category", c));
    } else {
      query.append("category", categories);
    }
  }

  if (searchParams.minPrice)
    query.set("minPrice", searchParams.minPrice.toString());
  if (searchParams.maxPrice)
    query.set("maxPrice", searchParams.maxPrice.toString());
  if (searchParams.rating) query.set("rating", searchParams.rating.toString());
  if (searchParams.inStock)
    query.set("inStock", searchParams.inStock.toString());
  if (searchParams.sort) query.set("sort", searchParams.sort.toString());

  const products = await getProducts(query);
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-col container mx-auto px-4 py-8 ">
          <h1 className="text-3xl font-bold mb-6">Products</h1>
          <div className="flex justify-between align-middle">
            {" "}
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
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="flex justify-between align-middle">
          {" "}
          <Filters filters={filters} />
          <Sorting />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products?.map((product) => (
            <Card key={product.id} className="shadow-md">
              <CardContent className="space-y-2 flex flex-col h-full justify-between">
                <img src={product.image} alt={product.title} className="" />
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-muted-foreground">${product.price}</p>
                <p>Rating: {product.rating}</p>
                <p>Category: {product.category}</p>
                <Button className="w-full mt-2 bg-blue-700" variant="default">
                  <ShoppingCart></ShoppingCart> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Productpage;
