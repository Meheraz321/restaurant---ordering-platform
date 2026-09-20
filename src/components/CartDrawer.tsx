import React, { useState } from 'react';
import { CartItem, RestaurantSettings } from '../types.ts';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  Truck,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: { code: string; discountAmount: number; description?: string } | null;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  settings: RestaurantSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  settings,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = items.length > 0 ? (isFreeDelivery ? 0 : settings.deliveryFee) : 0;
  const tax = Number(((taxableAmount * settings.taxRatePercent) / 100).toFixed(2));
  const total = Number((taxableAmount + deliveryFee + tax).toFixed(2));

  const amountNeededForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await onApplyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between text-left">
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-stone-100">Your Dining Cart</h2>
                <p className="text-xs text-stone-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} curated
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Free Delivery Goal Bar */}
            {items.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-stone-300">
                    <Truck className="w-4 h-4 text-amber-400" />
                    {isFreeDelivery ? (
                      <span className="text-emerald-400 font-semibold">Complimentary Delivery Unlocked!</span>
                    ) : (
                      <span>
                        Add <strong className="text-amber-400">${amountNeededForFreeDelivery.toFixed(2)}</strong> for free delivery
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold">{freeDeliveryProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-950 border border-stone-800 mx-auto flex items-center justify-center text-stone-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-stone-300 text-base mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Explore our woodfire specialties and handcrafted pasta to begin your culinary journey.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex gap-3.5 group transition-colors hover:border-stone-700"
                >
                  {/* Item Image */}
                  <img
                    src={cartItem.food.image}
                    alt={cartItem.food.name}
                    className="w-18 h-18 rounded-xl object-cover bg-stone-900 flex-shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-semibold text-sm text-stone-100 line-clamp-1">
                          {cartItem.food.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.id)}
                          aria-label="Remove item"
                          className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant badge */}
                      {cartItem.selectedVariant && (
                        <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                          {cartItem.selectedVariant.name}
                        </div>
                      )}

                      {/* Addon chips */}
                      {cartItem.selectedAddons && cartItem.selectedAddons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cartItem.selectedAddons.map((ad) => (
                            <span
                              key={ad.id}
                              className="text-[10px] bg-stone-900 border border-stone-800 text-stone-400 px-1.5 py-0.5 rounded"
                            >
                              +{ad.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-900">
                      <div className="text-xs font-bold text-amber-400">
                        ${(cartItem.itemPrice * cartItem.quantity).toFixed(2)}
                      </div>

                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, -1)}
                          className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-stone-100">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, 1)}
                          className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-800 bg-stone-950/90 space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Promo code <strong>{appliedCoupon.code}</strong> applied (-${appliedCoupon.discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-stone-400 hover:text-rose-400 font-semibold text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="Promo code (e.g. WELCOME10)"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-500 uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-amber-300 font-semibold text-xs rounded-xl border border-stone-700 transition-colors"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                  {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                </div>
              )}

              {/* Cost Calculations */}
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-stone-200 font-medium">
                    {deliveryFee === 0 ? <strong className="text-emerald-400">Free</strong> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({settings.taxRatePercent}%)</span>
                  <span className="text-stone-200 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-100 pt-2 border-t border-stone-800">
                  <span>Grand Total</span>
                  <span className="text-amber-400 text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                id="cart-checkout-button"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/25 transition-all hover:scale-101 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
