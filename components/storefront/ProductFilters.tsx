'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  onCategoryChange?: (category: string) => void;
  onPriceChange?: (range: [number, number]) => void;
}

export function ProductFilters({
  categories,
  onCategoryChange,
  onPriceChange,
}: ProductFiltersProps) {
  const [openFilters, setOpenFilters] = useState<string[]>(['categories']);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const toggleFilter = (filter: string) => {
    setOpenFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryChange?.(value);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    onPriceChange?.(value);
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* Categories Filter */}
      <div className="border-b border-neutral-200 pb-4">
        <button
          onClick={() => toggleFilter('categories')}
          className="w-full flex items-center justify-between font-semibold text-neutral-900 hover:text-sage-600 transition"
        >
          Categories
          <ChevronDown
            className={`w-4 h-4 transition ${openFilters.includes('categories') ? '' : '-rotate-90'}`}
          />
        </button>
        {openFilters.includes('categories') && (
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-neutral-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={selectedCategory === cat.value}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-neutral-700">{cat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-neutral-200 pb-4">
        <button
          onClick={() => toggleFilter('price')}
          className="w-full flex items-center justify-between font-semibold text-neutral-900 hover:text-sage-600 transition"
        >
          Price
          <ChevronDown
            className={`w-4 h-4 transition ${openFilters.includes('price') ? '' : '-rotate-90'}`}
          />
        </button>
        {openFilters.includes('price') && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-neutral-600 mb-2">
                Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
