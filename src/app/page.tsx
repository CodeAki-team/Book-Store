
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import img1 from "../assets/HeroImage1.jpg";
import img2 from "../assets/HeroImage2.jpg";
import img3 from "../assets/HeroImage3.jpg";

const images = [img1, img2, img3];

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);
    
    const handleClick = (direction: "next" | "prev") => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => {
                if (direction === "next") return (prevIndex + 1) % images.length;
                return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
            });
            setIsFading(false);
        }, 400); // match with fade CSS
    };

    return (
        <main className="min-h-[85vh] flex items-start justify-center pt-8 bg-gray-100">
            <section className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row bg-white shadow-xl overflow-hidden rounded-2xl">
                {/* Text Section */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white z-10 relative">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Welcome to <span className="text-blue-600">INKSPIRE</span>
                    </h1>
                    <p className="text-gray-700 text-xl mb-6">
                        Dive into a world of stories. INKSPIRE is your go-to online bookstore, offering a curated collection for every reader.
                    </p>
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/products"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 w-max"
                        >
                            View Products
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="absolute hidden md:block left-1/2 top-0 h-full w-20 z-0">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M0,0 C50,50 50,50 100,100 L100,0 Z" fill="#ffffff" />
                    </svg>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-[400px] overflow-hidden">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Slide ${currentImageIndex + 1}`}
                        fill
                        className={`object-cover rounded-r-2xl transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
                        priority
                    />

                    {/* Prev/Next Buttons */}
                    <button
                        onClick={() => handleClick("prev")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-3 py-2 rounded-full shadow-md transition"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => handleClick("next")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-3 py-2 rounded-full shadow-md transition"
                    >
                        ▶
                    </button>

                    {/* Slide Indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>
            </section>
        </main>
    );
>>>>>>> 5e4b6bc4bb65c842aac241992edeea40455d09a4
}
