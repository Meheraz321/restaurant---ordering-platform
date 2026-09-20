import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { CartItem, OrderType, PaymentMethod, RestaurantSettings, Order } from '../types.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderPlaced: (order: Order) => void;
  appliedCoupon: { code: string; discountAmount: number } | null;
  settings: RestaurantSettings;
  onOpenTracker: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  appliedCoupon,
  settings,
  onOpenTracker,
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('Julian Croft');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 234-5678');
  const [customerEmail, setCustomerEmail] = useState('julian.croft@example.com');

  // Delivery details
  const [address, setAddress] = useState('742 Evergreen Terrace, Apt 4B');
  const [area, setArea] = useState('Culinary Heights');
  const [district] = useState('Metropolis Central');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Please leave with concierge if unavailable.');

  // Dine-in specifics
  const [tableNumber, setTableNumber] = useState('T-01');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [mobileNumber, setMobileNumber] = useState('01700000000');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Financial calculations
  const subtotal = cartItems.reduce((sum, it) => sum + it.itemPrice * it.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : settings.deliveryFee) : 0;
  const tax = Number(((taxableAmount * settings.taxRatePercent) / 100).toFixed(2));
  const total = Number((taxableAmount + deliveryFee + tax).toFixed(2));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        deliveryAddress:
          orderType === 'delivery'
            ? {
                address,
                area,
                district,
                instructions: deliveryInstructions,
              }
            : undefined,
        items: cartItems.map((c) => ({
          foodId: c.food.id,
          name: c.food.name,
          image: c.food.image,
          price: c.itemPrice,
          quantity: c.quantity,
          variant: c.selectedVariant?.name,
          addons: c.selectedAddons.map((a) => a.name),
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
        specialInstructions: deliveryInstructions,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedOrder(data.data);
        onOrderPlaced(data.data);

        // Celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#ea580c', '#ffffff'],
        });
      }
    } catch (err) {
      console.error('Order placement failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Ember & Spice Dining
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-100">
              {confirmedOrder ? 'Order Confirmed' : 'Checkout & Payment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-stone-100">
                Your Table Order is Placed!
              </h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                Thank you, <strong className="text-stone-200">{confirmedOrder.customerName}</strong>. Our kitchen
                hearth has received your ticket and the chef has commenced preparations.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-stone-950 rounded-2xl border border-stone-800 p-5 text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Order Reference</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Dining Mode</span>
                <span className="uppercase font-semibold text-stone-200">{confirmedOrder.orderType}</span>
              </div>
              {confirmedOrder.tableNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Table Number</span>
                  <span className="font-bold text-amber-400">{confirmedOrder.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Estimated Ready In</span>
                <span className="font-bold text-stone-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {confirmedOrder.estimatedTimeMinutes} minutes
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-800 text-sm font-bold text-stone-100">
                <span>Grand Total Paid</span>
                <span className="text-amber-400">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenTracker(confirmedOrder);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Track Live Order</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
              >
                Back to Restaurant
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 1. Order Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                1. Select Dining Experience
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { id: 'delivery', label: 'Home Delivery', icon: MapPin, desc: 'Hot thermal delivery' },
                  { id: 'dine-in', label: 'Dine-In Table', icon: Utensils, desc: 'Served at your table' },
                  { id: 'takeaway', label: 'Takeaway Pickup', icon: ShoppingBag, desc: 'Curbside or counter' },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = orderType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOrderType(opt.id as OrderType)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-600/15 border-amber-500 text-amber-200 shadow-md'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                      <div className="text-xs font-bold text-stone-200">{opt.label}</div>
                      <div className="text-[10px] text-stone-400 hidden sm:block">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Customer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* 3. Address or Dine-In table details */}
            {orderType === 'delivery' && (
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Destination
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-stone-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Neighborhood / Area</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Delivery Notes</label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Gate code, buzzer or concierge instructions"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {orderType === 'dine-in' && (
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                  <Utensils className="w-3.5 h-3.5" />
                  Table Assignment
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48">
                    <label className="block text-[11px] text-stone-400 mb-1">Select Table Number</label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="T-01">T-01 (Window Corner - 2 Seats)</option>
                      <option value="T-02">T-02 (Romantic Booth - 2 Seats)</option>
                      <option value="T-03">T-03 (Grand Center - 6 Seats)</option>
                      <option value="T-04">T-04 (Courtyard Terrace - 4 Seats)</option>
                      <option value="T-07">T-07 (Sommelier Vault - 4 Seats)</option>
                      <option value="T-09">T-09 (Sovereign VIP Suite - 10 Seats)</option>
                    </select>
                  </div>
                  <p className="text-xs text-stone-400 flex-1 pt-4">
                    Our waitstaff will serve dishes freshly prepared as they leave the hearth.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Payment Methods */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                4. Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard, badge: 'Stripe Ready' },
                  { id: 'cod', label: 'Cash on Arrival', icon: Banknote, badge: 'Pay at Door' },
                  { id: 'bkash', label: 'bKash Mobile', icon: Smartphone, badge: 'Instant' },
                  { id: 'nagad', label: 'Nagad Mobile', icon: Smartphone, badge: 'Instant' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-600/15 border-amber-500 text-amber-200'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                        <span className="text-[9px] bg-stone-900 border border-stone-800 px-1 py-0.5 rounded text-stone-400">
                          {m.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-200">{m.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-semibold text-stone-300">Stripe Card Gateway</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="col-span-3 sm:col-span-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* bKash/Nagad Mobile Banking Simulator */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
                  <div className="text-xs font-semibold text-stone-300">
                    {paymentMethod === 'bkash' ? 'bKash Merchant Pay' : 'Nagad Direct Gateway'}
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Please provide your mobile wallet number. A simulated verification prompt will confirm your payment.
                  </p>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Bottom Total & Submit */}
            <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-stone-400">
                  Total Payable <span className="text-[11px]">({cartItems.length} items)</span>:
                </div>
                <div className="text-2xl font-bold text-amber-400">${total.toFixed(2)}</div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Transmitting to Kitchen...</span>
                ) : (
                  <>
                    <span>Confirm & Authorize ${total.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
