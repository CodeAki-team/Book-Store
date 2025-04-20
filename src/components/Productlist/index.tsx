"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import AddToCartButton from "../addCartbtn/addCartbtn";

interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    rating: number;
    category: string;
    stock: number;
}

interface ProductListProps {
    products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
    const searchParams = useSearchParams();

    const selectedCategories = searchParams.getAll("category");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");
    const minRating = parseFloat(searchParams.get("rating") || "0");
    const inStockOnly = searchParams.get("inStock") === "true";

    const filteredProducts = products.filter((product) => {
        const matchCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);

        const matchPrice =
            product.price >= minPrice && product.price <= maxPrice;

        const matchRating = product.rating >= minRating;

        const matchStock = !inStockOnly || product.stock > 0;

        return matchCategory && matchPrice && matchRating && matchStock;
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 text-xl">
                    No products match the selected filters.
                </p>
            ) : (
                filteredProducts.map((product, index) => (
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
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        width={200}
                                        height={250}
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

                                    <AddToCartButton product={product} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
