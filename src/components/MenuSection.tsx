import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types.ts';
import { FoodCard3D } from './3d/FoodCard3D.tsx';
import {
  Search,
  Filter,
  Flame,
  Sparkles,
  UtensilsCrossed,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

interface MenuSectionProps {
  foodItems: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
  onAddToCart: (item: FoodItem, e: React.MouseEvent) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  foodItems,
  onSelectItem,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [onlyChefsSpecial, setOnlyChefsSpecial] = useState(false);

  const categories = [
    'All',
    'Chef Specials',
    'Steak & Woodfire',
    'Main Course',
    'Seafood',
    'Pasta',
    'Artisan Pizza',
    'Gourmet Burgers',
    'Desserts',
  ];

  const filteredAndSortedItems = useMemo(() => {
    return foodItems
      .filter((item) => {
        // Category match
        if (selectedCategory === 'Chef Specials' && !item.isChefSpecial) return false;
        if (selectedCategory !== 'All' && selectedCategory !== 'Chef Specials' && item.category !== selectedCategory) {
          return false;
        }

        // Dietary toggles
        if (onlyVeg && !item.isVeg) return false;
        if (onlyChefsSpecial && !item.isChefSpecial) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchIngredients) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // recommended
      });
  }, [foodItems, selectedCategory, searchQuery, sortBy, onlyVeg, onlyChefsSpecial]);

  return (
    <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-stone-950 text-left">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Curated Culinary Collection</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 mb-4 tracking-tight">
            Artisanal Dishes Crafted with Fire
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Every creation is prepared over authentic white oak embers, balancing primal smokiness with modern Michelin-grade refinement.
          </p>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-stone-900/60 border border-stone-800 shadow-xl backdrop-blur-md mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Wagyu, Truffle, Lobster..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-500 hover:text-stone-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Dietary Filters & Sort Selector */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => setOnlyVeg(!onlyVeg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  onlyVeg
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                🌱 Vegetarian
              </button>

              <button
                onClick={() => setOnlyChefsSpecial(!onlyChefsSpecial)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  onlyChefsSpecial
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Chef's Specials
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="rating">Sort: Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-stone-800/80">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold shadow-md shadow-amber-600/20 scale-102'
                    : 'bg-stone-950/70 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Food Cards Grid */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-stone-900/40 border border-stone-800">
            <UtensilsCrossed className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-stone-300 mb-1">
              No matching delicacies found
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Try adjusting your dietary filters or search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyVeg(false);
                setOnlyChefsSpecial(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 text-stone-950 text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <FoodCard3D
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
