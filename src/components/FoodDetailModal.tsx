import React, { useState } from 'react';
import { FoodItem, FoodAddon, FoodVariant } from '../types.ts';
import {
  X,
  Star,
  Plus,
  Minus,
  Flame,
  Clock,
  Sparkles,
  Heart,
  Check,
  ShoppingBag,
  Zap,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, addons: FoodAddon[], variant?: FoodVariant, specialInstructions?: string) => void;
  onBuyNow: (item: FoodItem, quantity: number, addons: FoodAddon[], variant?: FoodVariant, specialInstructions?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (item: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<FoodAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Calculate live item price
  const basePrice = item.price + (selectedVariant ? selectedVariant.priceDelta : 0);
  const addonsTotal = selectedAddons.reduce((sum, ad) => sum + ad.price, 0);
  const singleUnitPrice = basePrice + addonsTotal;
  const totalPrice = singleUnitPrice * quantity;

  const toggleAddon = (addon: FoodAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAdd = () => {
    setAddedSuccess(true);
    onAddToCart(item, quantity, selectedAddons, selectedVariant, specialInstructions);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 600);
  };

  const handleBuy = () => {
    onBuyNow(item, quantity, selectedAddons, selectedVariant, specialInstructions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 flex items-center justify-center transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Food Imagery & Quick Badges */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-950 min-h-[300px]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />

            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist(item)}
              aria-label="Wishlist"
              className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-stone-950/80 hover:bg-stone-800 border border-stone-700 flex items-center justify-center transition-colors shadow-lg"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-300'
                }`}
              />
            </button>

            {/* Badges Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 z-10">
              {item.isChefSpecial && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/95 text-stone-950 text-xs font-bold tracking-wider uppercase shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  Chef's Signature
                </span>
              )}
              {item.isVeg && (
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Vegetarian
                </span>
              )}
              {item.isSpicy && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600/90 text-white text-xs font-bold tracking-wider uppercase shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Spicy Level {item.spiceLevel || 1}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Culinary Details, Customizations, and Order Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-stone-200">{item.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-stone-500">({item.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-100 mb-2 leading-tight">
                {item.name}
              </h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-amber-400">${basePrice.toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="text-sm text-stone-500 line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-300 leading-relaxed mb-5">
                {item.description}
              </p>

              {/* Quick Spec Matrix */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Prep: <strong className="text-stone-100">{item.prepTime}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Energy: <strong className="text-stone-100">{item.calories} kcal</strong></span>
                </div>
              </div>

              {/* Allergens & Key Ingredients */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Allergens
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.allergens.map((al) => (
                      <span
                        key={al}
                        className="px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 text-xs border border-stone-700/60"
                      >
                        {al}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Artisanal Ingredients
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-200/90 text-xs border border-amber-500/20"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants Selector */}
              {item.variants && item.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Select Preparation / Temperature
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {v.name}
                        {v.priceDelta > 0 && (
                          <span className="ml-1 text-amber-400">(+${v.priceDelta.toFixed(2)})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gourmet Add-ons */}
              {item.addons && item.addons.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Gourmet Enhancements & Add-ons
                  </label>
                  <div className="space-y-2">
                    {item.addons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                              : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                                  : 'border-stone-600 bg-stone-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{addon.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-amber-400">
                            +${addon.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Cooking Instructions */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                  Special Kitchen Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra sauce on side, dressing separate..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-stone-950 border border-stone-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 flex items-center justify-center disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-stone-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Total */}
                <div className="text-right">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">Total</div>
                  <div className="text-xl font-bold text-amber-400">${totalPrice.toFixed(2)}</div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-600/20 active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
