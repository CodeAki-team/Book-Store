"use client";

import React from "react";

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

    const increaseQuantity = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };
    
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

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md">
                            <button
                                onClick={decreaseQuantity}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300 cursor-pointer"
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <p className="text-xl font-semibold text-gray-700 cursor-pointer">{quantity}</p>
                            <button
                                onClick={increaseQuantity}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300 cursor-pointer"
                                disabled={quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>

                        {/* Total Price */}
                        <div className="bg-blue-100 p-4 rounded-lg shadow-md mt-4">
                            <p className="text-lg font-semibold text-gray-800">Total: ${totalPrice.toFixed(2)}</p>
                        </div>

                        {/* Actions: Add to Cart, Go Back */}
                        <div className="flex space-x-4 mt-6">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer">
                                Add to Cart
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer">
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
