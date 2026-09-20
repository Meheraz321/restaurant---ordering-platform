import React, { useState } from 'react';
import {
  Flame,
  ShoppingBag,
  User as UserIcon,
  Calendar,
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  Bell,
  Menu as MenuIcon,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { AppNotification, RestaurantSettings } from '../types.ts';

interface NavbarProps {
  currentView: 'home' | 'menu' | 'story' | 'reservations' | 'gallery' | 'contact' | 'kitchen' | 'admin' | 'account';
  setCurrentView: (view: any) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  settings: RestaurantSettings;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  onOpenCart,
  onOpenAccount,
  notifications,
  onOpenNotifications,
  settings,
  onSearchClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'Our Story', view: 'story' },
    { label: 'Reservations', view: 'reservations' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-xl transition-all duration-300">
      {/* Top Banner Bar for Fast Role Switcher */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 py-1.5 text-xs text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-stone-300">
              Open Today: <span className="text-amber-400 font-semibold">{settings.openingHours.weekdays}</span>
            </span>
          </div>

          {/* Quick Demo Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-stone-950/80 px-2 py-0.5 rounded-full border border-stone-800 text-[11px]">
            <span className="text-stone-400 font-medium mr-1">Switch View:</span>
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                !['kitchen', 'admin'].includes(currentView)
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Guest Dining
            </button>
            <button
              onClick={() => handleNavClick('kitchen')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                currentView === 'kitchen'
                  ? 'bg-orange-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <ChefHat className="w-3 h-3" />
              Kitchen KDS
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                currentView === 'admin'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wider text-stone-100 group-hover:text-amber-400 transition-colors">
              {settings.brandName}
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-amber-500/90 font-medium">
              Fine Dining & Hearth
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`relative text-sm font-medium tracking-wide transition-colors py-1 ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-amber-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Search, Notifications, Cart, Account, Book CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Search */}
          <button
            onClick={onSearchClick}
            aria-label="Search menu"
            className="w-10 h-10 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 flex items-center justify-center transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            id="navbar-cart-button"
            aria-label="Shopping Cart"
            className="relative flex items-center gap-2 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-200 hover:text-amber-300 px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <button
            onClick={onOpenAccount}
            aria-label="Customer Account"
            className="w-10 h-10 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 flex items-center justify-center transition-colors"
            title="My Orders & Profile"
          >
            <UserIcon className="w-4 h-4" />
          </button>

          {/* Reserve Table CTA (Desktop) */}
          <button
            onClick={() => handleNavClick('reservations')}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:scale-102 active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Book Table</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-stone-900 text-stone-300 border border-stone-800 flex items-center justify-center"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-left text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                  currentView === link.view
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('reservations')}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-xl shadow-md text-sm uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              Reserve A Table
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold py-3 rounded-xl border border-stone-800 text-sm"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              Explore Online Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
