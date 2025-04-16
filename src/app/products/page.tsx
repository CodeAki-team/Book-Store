import Filters from "@/components/ProductFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFilters } from "@/lib/get-filters";
import { getProducts } from "@/lib/get-products";
import React from "react";

async function Productpage({ searchParams }: { searchParams: any }) {
  const filters = await getFilters();
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => [key, String(value)])
    )
  );
  
  const products = await getProducts(query);

  // {products.length > 0 ? (
  //   <ProductList products={products} />
  // ) : (
  //   <div className="text-center py-10 text-muted-foreground">
  //     No products found with the selected filters.
  //   </div>
  // )}
  

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <Filters filters={filters} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products?.map((product) => (
            <Card key={product.id} className="shadow-md">
              <CardContent className="space-y-2">
                <img src={product.image} alt="" />
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-muted-foreground">${product.price}</p>
                <p>Rating: {product.rating}</p>
                <p>Category: {product.category}</p>
                <Button className="w-full mt-2 bg-blue-700" variant="default">
                  Add to Cart
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
