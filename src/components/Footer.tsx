import React, { useState } from 'react';
import { Flame, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, ArrowRight, Check } from 'lucide-react';
import { RestaurantSettings } from '../types.ts';

interface FooterProps {
  settings: RestaurantSettings;
  onNavigate: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer id="contact" className="border-t border-stone-800 bg-stone-950 text-stone-300 text-left pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-stone-950 shadow-lg">
                <Flame className="w-6 h-6 fill-stone-950" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-stone-100">
                  {settings.brandName}
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-amber-500 font-medium">
                  {settings.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Fine dining and woodfire gastronomy. Dedicated to exceptional heritage ingredients, open-hearth mastery, and timeless culinary hospitality.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-stone-100 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                  Home & 3D Experience
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-400 transition-colors">
                  Culinary Menu Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reservations')} className="hover:text-amber-400 transition-colors">
                  Reserve a Table
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-amber-400 transition-colors">
                  Our White Oak Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kitchen')} className="hover:text-amber-400 transition-colors">
                  Kitchen KDS Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-amber-400 transition-colors">
                  Executive Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-stone-100 uppercase tracking-wider">
              Visit & Contact
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-stone-900">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-300 font-medium">Dinner Hours</div>
                  <div>Mon-Thu: {settings.openingHours.weekdays}</div>
                  <div>Fri-Sun: {settings.openingHours.weekends}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Private Tasting Club Newsletter */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-stone-100 uppercase tracking-wider">
              Private Cellar Club
            </h4>
            <p className="text-xs text-stone-400">
              Receive secret seasonal tasting menus, wine release previews, and exclusive reservation slots.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Join Exclusive Club</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-stone-300 transition-colors">Terms of Dining</a>
            <a href="#accessibility" className="hover:text-stone-300 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
