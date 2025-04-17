"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import clsx from "clsx";
import "animate.css";

interface Product {
  id: number;
  title: string;
  image: string;
  rating: number;
}

const rankStyles = {
  1: "text-yellow-500 drop-shadow-[0_2px_4px_rgba(255,215,0,0.6)]",
  2: "text-gray-400 drop-shadow-[0_2px_4px_rgba(160,160,160,0.4)]",
  3: "text-amber-700 drop-shadow-[0_2px_4px_rgba(205,127,50,0.4)]",
};

export default function TopProductsSlider({
  products,
}: {
  products: Product[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const groupSize = 3;
  const totalGroups = Math.ceil(products.length / groupSize);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentProducts = products.slice(
    currentIndex * groupSize,
    currentIndex * groupSize + groupSize
  );

  return (
    <section className="w-[80%] m-3 rounded-xl relative bg-gray-100 from-white via-slate-50 to-white py-16 border-y border-gray-200 shadow-inner">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-16 animate__animated animate__fadeInDown">
          Most Rated Books
        </h2>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={prevSlide}
            variant="ghost"
            className="hidden lg:flex"
          >
            <ChevronLeft size={28} />
          </Button>

          <div className="flex flex-wrap justify-center gap-10 w-full max-w-6xl animate__animated animate__fadeInUp">
            {currentProducts.map((product, index) => {
              const globalRank = currentIndex * groupSize + index + 1;
              const rankColor =
                rankStyles[globalRank as 1 | 2 | 3] || "text-gray-500";

              return (
                <div
                  key={product.id}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={clsx(
                      "absolute -top-[84px] -left-11 text-[150px] font-extrabold opacity-30 z-0 select-none transition-all duration-300",
                      rankColor
                    )}
                    style={{ lineHeight: 1 }}
                  >
                    {globalRank}
                  </div>

                  <Card className="h-full relative z-10 w-[280px] rounded-3xl shadow-xl border hover:scale-[1.05] transition-all duration-300 bg-white">
                    <CardContent className="pt-6">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={260}
                        height={200}
                        className="w-full h-[300px] object-cover rounded-xl mb-4"
                      />
                      <h3 className="text-xl font-bold text-center">
                        {product.title}
                      </h3>
                      <div className="flex justify-center items-center gap-1 mt-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < Math.round(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            fill={
                              i < Math.round(product.rating)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          ({product.rating})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <Button
            onClick={nextSlide}
            variant="ghost"
            className="hidden lg:flex"
          >
            <ChevronRight size={28} />
          </Button>
        </div>
      </div>
    </section>
  );
}
