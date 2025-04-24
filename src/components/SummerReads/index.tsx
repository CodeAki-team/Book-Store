"use client";
import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; 

interface Book {
    id: number;
    title: string;
    image: string;
    rating: number;
}

export default function SummerReads() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await fetch("/api/explore");
            const data = await res.json();
            setBooks(data);
        };

        fetchBooks();
    }, []);

    return (
        <section className="w-full mx-auto py-8 px-4 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 p-10 shadow-md">
                    <h2 className="text-3xl font-bold text-white mb-10 text-left drop-shadow-sm">
                        Summer Reads
                    </h2>

                    <div className="flex flex-wrap gap-10 justify-start cursor-pointer">
                        {books.map((book) => (
                            <Link
                                key={book.id}
                                href={`/products/${book.id}`} 
                                className="w-[260px] h-[450px] bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-gray-200 no-underline"
                            >
                                <CardContent className="flex flex-col justify-start p-4 h-full">
                                    {/* Image */}
                                    <div className="relative w-full h-[280px] rounded-md overflow-hidden mb-4">
                                        <Image
                                            src={book.image}
                                            alt={book.title}
                                            width={240}
                                            height={280}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-800 text-left leading-tight">
                                        {book.title}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center mt-2 text-yellow-500 text-lg sm:text-xl">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="mr-1">
                                                {i < Math.round(book.rating) ? "★" : "☆"}
                                            </span>
                                        ))}
                                        <span className="ml-2 text-gray-600 text-sm sm:text-base">
                                            {book.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
