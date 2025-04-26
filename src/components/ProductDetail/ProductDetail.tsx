"use client";

import React from "react";
import AddCartBtn from "../addCartbtn/addCartbtn";

type Product = {
    id: string;
    title: string;
    image: string;
    price: number;
    stock: number;
    description: string;
    category: string;
};

export const ProductDetail = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = React.useState(1);

    const totalPrice = product.price * quantity;

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 p-8">
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Image */}
                    <div className="w-full md:w-1/3 flex justify-center mt-17">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-120 object-cover rounded-xl shadow-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-2/3 space-y-6">
                        {/* Product Title */}
                        <div>
                            <h1 className="text-4xl font-semibold text-gray-900">{product.title}</h1>
                            <p className="text-xl text-blue-600 mt-2">${product.price}</p>
                        </div>

                        {/* Product Category */}
                        <div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500">Category: <span className="font-semibold text-gray-700">{product.category}</span></p>
                        </div>

                        {/* Product Description */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-medium text-gray-800">Description</h2>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                        </div>

                        {/* Stock Information */}
                        <div className="bg-green-100 p-3 rounded-lg border-l-4 border-green-500">
                            <p className="text-lg text-gray-700">{product.stock} {product.stock > 1 ? 'items' : 'item'} in stock</p>
                        </div>

                        {/* Total Price */}
                        <div className="bg-blue-100 p-4 rounded-lg shadow-md mt-4">
                            <p className="text-lg font-semibold text-gray-800">Total: ${totalPrice.toFixed(2)}</p>
                        </div>

                        <div className="mt-6 space-y-4"> {/* Use space-y-4 to give space between buttons vertically */}
                            {/* Add to Cart Button */}
                            <AddCartBtn
                                product={product}
                                className="px-6 py-2 transition-all duration-300 cursor-pointer text-lg w-full"
                            />

                            {/* Go Back Button */}
                            <button
                                onClick={() => window.history.back()}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 ease-in-out cursor-pointer text-lg w-full"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detailed Book Description Section */}
                <div className="mt-12 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                        <h3 className="text-3xl font-semibold text-gray-900">More about {product.title}</h3>
                        <p className="text-gray-700 mt-2">
                            Dive deeper into the world of {product.title}, a story that takes you through {product.description}.
                            This book explores themes of <i>fantasy, mystery, and adventure</i>, all while delivering a gripping narrative that captivates the reader from the very first page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
