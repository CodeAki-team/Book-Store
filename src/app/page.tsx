"use client";

import Image from "next/image";
import bannerImg from "/public/banner1.jpg"; // Replace with your actual image path

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <section className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row bg-white shadow-lg overflow-hidden rounded-2xl">
                {/* Left Text Section */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white z-10 relative">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to <span className="text-blue-600">INKSPIRE</span></h1>
                    <p className="text-gray-700 text-lg">
                        Dive into a world of stories. INKSPIRE is your go-to online bookstore, offering a curated collection for every reader.
                    </p>
                </div>

                {/* Divider Shape */}
                <div className="absolute hidden md:block left-1/2 top-0 h-full w-20 z-0">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M0,0 C50,50 50,50 100,100 L100,0 Z" fill="#ffffff" />
                    </svg>
                </div>

                {/* Right Image Section */}
                <div className="w-full md:w-1/2 relative">
                    <Image
                        src={bannerImg}
                        alt="Bookstore Banner"
                        layout="responsive"
                        width={600}
                        height={400}
                        className="object-cover h-full w-full"
                        priority
                    />
                </div>
            </section>
        </main>
    );
}
