import React, { useState, useRef } from 'react';
import { FoodItem } from '../../types.ts';
import { Star, Plus, Flame, Sparkles, Clock, Eye, Check } from 'lucide-react';

interface FoodCard3DProps {
  item: FoodItem;
  onSelect: (item: FoodItem) => void;
  onAddToCart: (item: FoodItem, e: React.MouseEvent) => void;
}

export const FoodCard3D: React.FC<FoodCard3DProps> = ({ item, onSelect, onAddToCart }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 8; // Max 8 deg rotation
    const rX = -((y - centerY) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
    onAddToCart(item, e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
      }}
      className="group relative flex flex-col justify-between rounded-2xl bg-stone-900/70 border border-stone-800/80 hover:border-amber-500/40 p-4 shadow-xl cursor-pointer overflow-hidden backdrop-blur-md hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(254, 240, 138, ${glarePos.opacity}), transparent 60%)`,
        }}
      />

      {/* Top Image & Floating Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-950">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex flex-wrap gap-1.5">
            {item.isChefSpecial && (
              <span className="flex items-center gap-1 rounded-full bg-amber-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-50 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-200" />
                Chef's Special
              </span>
            )}
            {item.isPopular && !item.isChefSpecial && (
              <span className="flex items-center gap-1 rounded-full bg-rose-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                Popular
              </span>
            )}
            {item.isVeg && (
              <span className="rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                Veg
              </span>
            )}
          </div>

          {/* Spice Indicator */}
          {item.isSpicy && (
            <div className="flex items-center gap-0.5 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/20 text-orange-400 text-[10px] font-semibold">
              <Flame className="w-3 h-3 fill-orange-400" />
              {item.spiceLevel ? `x${item.spiceLevel}` : ''}
            </div>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <span className="flex items-center gap-1.5 bg-stone-950/90 text-amber-200 text-xs font-medium px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-xl backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            View Details
          </span>
        </div>

        {/* Cooking Time */}
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-stone-950/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-stone-300 border border-stone-800">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{item.prepTime}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between pt-3.5">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-base text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>
        </div>

        {/* Rating & Pricing Row */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-stone-200">{item.rating.toFixed(1)}</span>
              <span className="text-[10px] text-stone-500">({item.reviewsCount})</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-amber-400">${item.price.toFixed(2)}</span>
              {item.originalPrice && (
                <span className="text-xs text-stone-500 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleAddClick}
            id={`btn-add-${item.id}`}
            type="button"
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-md ${
              addedAnimation
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-amber-600/20 hover:shadow-amber-500/40'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
