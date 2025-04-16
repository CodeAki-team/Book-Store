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
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-col container mx-auto px-4 py-8 ">
          <h1 className="text-4xl font-bold mb-6 text-center">Products</h1>
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
        <h1 className="text-4xl font-bold mb-6 text-center">Products</h1>
        <div className="flex justify-between align-middle">
          {" "}
          <Filters filters={filters} />
          <Sorting />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products?.map((product, index) => (
            <div
              key={product.id}
              className={`h-full animate__animated animate__fadeInUp`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: "500ms",
              }}
            >
              <Card className="shadow-md h-full flex flex-col transition-all duration-300">
                <CardContent className="flex flex-col h-full p-4">
                  <div className="w-full h-[200px] flex items-center justify-center overflow-hidden rounded-md mb-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain h-full"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h2 className="text-lg font-semibold line-clamp-2">
                        {product.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        ${product.price}
                      </p>
                      <p className="text-sm text-yellow-600">
                        ⭐ {product.rating}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>

                    <Button
                      className="w-full mt-2 bg-blue-700 cursor-pointer"
                      variant="default"
                    >
                      <ShoppingCart></ShoppingCart> Add to Cart
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
