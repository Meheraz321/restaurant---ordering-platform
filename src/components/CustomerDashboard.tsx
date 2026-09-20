import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Calendar,
  Heart,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  X,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { Order, Reservation, FoodItem, Coupon } from '../types.ts';

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  reservations: Reservation[];
  wishlist: FoodItem[];
  coupons: Coupon[];
  onTrackOrder: (order: Order) => void;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromWishlist: (item: FoodItem) => void;
  onCancelReservation: (resId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  reservations,
  wishlist,
  coupons,
  onTrackOrder,
  onAddToCart,
  onRemoveFromWishlist,
  onCancelReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'wishlist' | 'coupons'>('orders');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with profile banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display text-2xl font-bold">
              JC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-100">
                  Julian Croft
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  VIP Connoisseur
                </span>
              </div>
              <p className="text-xs text-stone-400">julian.croft@example.com • +1 (555) 234-5678</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 border-b border-stone-800 bg-stone-950/60 flex gap-4 overflow-x-auto text-xs">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
            { id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
            { id: 'wishlist', label: 'Wishlist Dishes', icon: Heart, count: wishlist.length },
            { id: 'coupons', label: 'My Rewards', icon: Tag, count: coupons.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 border-b-2 font-medium transition-colors ${
                  isSelected
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-stone-800 text-[10px] text-stone-300">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-4">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  No orders placed yet. Explore our signature menu!
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          #{ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-900 border border-stone-800 text-stone-300">
                          {ord.orderType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ['delivered', 'served'].includes(ord.status)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-stone-300">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(' • ')}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400 uppercase">Paid</div>
                        <div className="text-lg font-bold text-amber-400">${ord.total.toFixed(2)}</div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(ord);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  No reservations booked. Reserve a table for tonight!
                </div>
              ) : (
                reservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-amber-400 text-sm">{r.reservationNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-900 border border-stone-800 text-stone-300">
                          {r.tableType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                          {r.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-200">
                        Date: <strong>{r.date}</strong> at <strong>{r.time}</strong> • {r.guests} Guests
                      </div>
                      {r.tableNumber && (
                        <div className="text-[11px] text-amber-400 mt-0.5">
                          Assigned Table: {r.tableNumber}
                        </div>
                      )}
                    </div>

                    {r.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancelReservation(r.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlist.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  You haven't bookmarked any favorite dishes yet. Click the heart icon on any card!
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display font-semibold text-sm text-stone-100">{item.name}</h4>
                        <div className="text-xs font-bold text-amber-400">${item.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item)}
                        className="p-2 text-stone-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((cpn) => (
                <div
                  key={cpn.id}
                  className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {cpn.code}
                    </span>
                    <span className="text-[10px] text-stone-400">Exp: {cpn.expiryDate}</span>
                  </div>
                  <div className="font-bold text-stone-100 text-sm">
                    {cpn.discountType === 'percentage' ? `${cpn.value}% Off Your Order` : `$${cpn.value} Off`}
                  </div>
                  <p className="text-[11px] text-stone-400">{cpn.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
