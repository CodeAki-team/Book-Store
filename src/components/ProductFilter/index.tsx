"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterIcon, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface FilterProps {
  filters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    minRating: number;
    maxRating: number;
  };
}

const ProductFilter = ({ filters }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);
  const [rating, setRating] = useState(0);

  // Initial sync with URL
  useEffect(() => {
    const categoriesFromUrl = searchParams.getAll("category");
    const minPriceFromUrl =
      Number(searchParams.get("minPrice")) || filters.minPrice;
    const maxPriceFromUrl =
      Number(searchParams.get("maxPrice")) || filters.maxPrice;
    const ratingFromUrl = Number(searchParams.get("rating")) || 0;

    setSelectedCategories(categoriesFromUrl);
    setPriceRange([minPriceFromUrl, maxPriceFromUrl]);
    setRating(ratingFromUrl);
  }, [searchParams, filters]);
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([filters.minPrice, filters.maxPrice]);
    setRating(0);

    router.push(window.location.pathname); 
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;

    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (
      priceRange[0] !== filters.minPrice ||
      priceRange[1] !== filters.maxPrice
    )
      count += 1;
    if (rating > 0) count += 1;

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    selectedCategories.forEach((cat) => params.append("category", cat));

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    if (rating) params.set("rating", rating.toString());

    router.push(`?${params.toString()}`);

  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative hover:bg-blue-700 hover:text-white">
        <FilterIcon></FilterIcon> Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl text-blue-700">Filters</SheetTitle>
          </SheetHeader>

          {/* Category */}
          <div className="mt-6">
            <Label className="font-semibold mb-2 block">Category</Label>
            <div className="space-y-2">
              {filters.categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={category} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <Label className="font-semibold mb-2 block">Price</Label>
            <Slider
              min={filters.minPrice}
              max={filters.maxPrice}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="text-sm mt-2 text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-6">
            <Label className="font-semibold mb-2 block">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`$ {
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  } hover:scale-110 transition-transform`}
                >
                  <Star size={20} fill={rating >= star ? "#facc15" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleApplyFilters}
            className="w-full mt-6 bg-blue-700 text-white hover:bg-blue-800"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Reset Filters
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductFilter;
