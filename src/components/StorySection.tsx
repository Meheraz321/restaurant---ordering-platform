import React from 'react';
import { Flame, Award, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-950 relative overflow-hidden text-left">
      {/* Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Imagery Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Restaurant interior"
                  className="rounded-3xl object-cover h-64 w-full shadow-2xl border border-stone-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Chef"
                  className="rounded-3xl object-cover h-48 w-full shadow-2xl border border-stone-800"
                />
              </div>

              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Woodfire grill steak"
                  className="rounded-3xl object-cover h-48 w-full shadow-2xl border border-stone-800"
                />
                <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 flex flex-col justify-between shadow-2xl">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-amber-400">800°C</div>
                    <div className="text-xs text-stone-300 font-medium">Binchotan & White Oak Open Hearth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Heritage</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 leading-tight">
              Where Fire Meets Finesse and Every Bite Becomes a Memory.
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Founded in 2018 by Executive Chef Marco Vance, <strong>Ember & Spice</strong> was born from a singular passion:
              harnessing the elemental power of open flames to elevate fine dining beyond traditional boundaries.
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              We meticulously age our wagyu cuts for 45 days in Himalayan salt cellars, import whole black truffles
              weekly from Umbria, and source heritage produce within 50 miles. Every dish tells a tale of smoke, temperature,
              and terroir.
            </p>

            {/* Accolades Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">18+</div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Culinary Awards</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">45-Day</div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Salt Cellar Aged</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">4.9 / 5</div>
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mt-0.5">Guest Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
