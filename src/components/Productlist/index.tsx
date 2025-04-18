import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    rating: number;
    category: string;
  }
  interface ProductListProps {
    products: Product[];
  }
const ProductList = ({products}:ProductListProps) => {
  return (
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
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-lg font-semibold text-blue-600">
                  ${product.price}
                </p>
                <p className="text-sm text-yellow-600">
                  ⭐ {product.rating} | {product.category}
                </p>
              </div>

              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer">
                <ShoppingCart className="mr-2" /> Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
  </div>

  )
}

export default ProductList