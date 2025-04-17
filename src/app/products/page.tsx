import Filters from "@/components/ProductFilter";
import Sorting from "@/components/Sorting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFilters } from "@/lib/get-filters";
import { getProducts } from "@/lib/get-products";
import { ShoppingCart } from "lucide-react";
import React from "react";

async function Productpage({
                             searchParams,
                           }: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = await getFilters();
  const query = new URLSearchParams();

  const categories = searchParams.category;
  if (categories) {
    if (Array.isArray(categories)) {
      categories.forEach((c) => query.append("category", c));
    } else {
      query.append("category", categories);
    }
  }

  if (searchParams.minPrice)
    query.set("minPrice", String(searchParams.minPrice));
  if (searchParams.maxPrice)
    query.set("maxPrice", String(searchParams.maxPrice));
  if (searchParams.rating) query.set("rating", String(searchParams.rating));
  if (searchParams.inStock) query.set("inStock", String(searchParams.inStock));
  if (searchParams.sort) query.set("sort", String(searchParams.sort));

  const products = await getProducts(query);
  if (products.length === 0) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
          <main className="flex flex-col container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">Products</h1>
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
          <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">Products</h1>
          <div className="flex justify-between items-center mb-8">
            <Filters filters={filters} />
            <Sorting />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products?.map((product, index) => (
                <div
                    key={product.id}
                    className="h-full animate__animated animate__fadeInUp"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationDuration: "500ms",
                    }}
                >
                  <Card className="shadow-xl h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden">
                    <CardContent className="flex flex-col h-full p-6 bg-white">
                      <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded-md mb-6">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="object-contain h-full"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{product.title}</h2>
                          <p className="text-lg font-semibold text-blue-600">${product.price}</p>
                          <p className="text-sm text-yellow-600">
                            ⭐ {product.rating} | {product.category}
                          </p>
                        </div>

                        <Button
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
                        >
                          <ShoppingCart className="mr-2" /> Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
            ))}
          </div>
        </main>
      </div>
  );
}

export default Productpage;
