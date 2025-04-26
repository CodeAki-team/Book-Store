"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);
  const [rating, setRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const unwrappedSearchParams = useMemo(() => {
    return {
      category: searchParams.getAll("category"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      rating: searchParams.get("rating"),
      inStock: searchParams.get("inStock"),
    };
  }, [searchParams]);

  useEffect(() => {
    const categoriesFromUrl = unwrappedSearchParams.category || [];
    const minPriceFromUrl =
        Number(unwrappedSearchParams.minPrice) || filters.minPrice;
    const maxPriceFromUrl =
        Number(unwrappedSearchParams.maxPrice) || filters.maxPrice;
    const ratingFromUrl = Number(unwrappedSearchParams.rating) || 0;
    const stockFromUrl = unwrappedSearchParams.inStock === "true";

    setSelectedCategories(categoriesFromUrl);
    setPriceRange([minPriceFromUrl, maxPriceFromUrl]);
    setRating(ratingFromUrl);
    setInStockOnly(stockFromUrl);
  }, [unwrappedSearchParams, filters]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([filters.minPrice, filters.maxPrice]);
    setRating(0);
    setInStockOnly(false);
    startTransition(() => {
      router.replace(pathname);
    });
  };

  const handleCategoryChange = (category: string, checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;
    setSelectedCategories((prev) =>
        checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    selectedCategories.forEach((cat) => params.append("category", cat));
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    if (rating > 0) params.set("rating", rating.toString());
    if (inStockOnly) params.set("inStock", "true");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (priceRange[0] !== filters.minPrice || priceRange[1] !== filters.maxPrice) count += 1;
    if (rating > 0) count += 1;
    if (inStockOnly) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
                variant="outline"
                className="relative hover:bg-blue-700 cursor-pointer hover:text-white"
            >
              <FilterIcon className="mr-2" /> Filters
              {activeFilterCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-3xl font-extrabold text-blue-700">
                Filters
              </SheetTitle>
            </SheetHeader>

            {/* Category */}
            <div className="mt-6 pl-3">
              <Label className="font-bold mb-2 block text-xl">Category</Label>
              <div className="space-y-2">
                {filters.categories.map((category) => (
                    <div
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) =>
                              handleCategoryChange(category, checked)
                          }
                      />
                      <Label htmlFor={category} className="capitalize cursor-pointer">
                        {category}
                      </Label>
                    </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 px-3">
              <Label className="font-semibold mb-2 block text-xl">Price</Label>
              <Slider
                  min={filters.minPrice}
                  max={filters.maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="cursor-pointer"
              />
              <div className="text-sm mt-2 text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>

            {/* Rating */}
            <div className="mt-6 px-3">
              <Label className="font-semibold mb-2 block text-xl">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-transform hover:scale-110 cursor-pointer ${
                            rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                    >
                      <Star size={20} fill={rating >= star ? "#facc15" : "none"} />
                    </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div className="mt-6 px-3 flex items-center justify-between">
              <Label className="font-semibold text-xl">In Stock Only</Label>
              <Switch
                  checked={inStockOnly}
                  onCheckedChange={setInStockOnly}
                  className="cursor-pointer"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 px-3">
              <Button
                  onClick={handleApplyFilters}
                  className="w-full bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
              >
                Apply Filters
              </Button>
              <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="w-full mt-2 hover:bg-gray-200 cursor-pointer"
              >
                Reset Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
  );
};

export default ProductFilter;
