import React from 'react';
import { Hero3DScene } from './3d/Hero3DScene.tsx';
import { Utensils, Calendar, Sparkles, Flame, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { RestaurantSettings } from '../types.ts';

interface HeroSectionProps {
  settings: RestaurantSettings;
  onExploreMenu: () => void;
  onReserveTable: () => void;
  onOrderOnline: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreMenu,
  onReserveTable,
  onOrderOnline,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 pt-8 pb-16 lg:py-20 text-left">
      {/* Background warm lighting halos */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Michelin Inspired Gastronomy</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.12]">
              Where Every Bite Becomes a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Memory.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Immerse yourself in our open-hearth culinary theatre. Handcrafted dry-aged steaks, fresh handmade pasta,
              and rare truffles prepared over authentic white oak embers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                id="hero-explore-menu-btn"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-600/25 flex items-center gap-2 hover:scale-102 active:scale-98"
              >
                <Utensils className="w-4 h-4 stroke-[2.5]" />
                <span>Explore Menu</span>
              </button>

              <button
                onClick={onReserveTable}
                id="hero-book-table-btn"
                className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs uppercase tracking-wider border border-stone-800 hover:border-amber-500/40 transition-all flex items-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Book Table</span>
              </button>

              <button
                onClick={onOrderOnline}
                className="px-5 py-3.5 rounded-xl text-amber-400 hover:text-amber-300 font-semibold text-xs tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>Order Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Key trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-stone-300 font-medium">Woodfire Hearth</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-stone-300 font-medium">A5 Miyazaki Wagyu</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-stone-300 font-medium">Free Delivery $80+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D WebGL Plate & Culinary Stage */}
          <div className="lg:col-span-6 relative">
            <Hero3DScene onExploreClick={onExploreMenu} />
          </div>
        </div>
      </div>
    </section>
  );
};
