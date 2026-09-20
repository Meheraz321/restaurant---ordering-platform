import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Utensils,
  MapPin,
  Phone,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const isDineIn = order.orderType === 'dine-in';

  // Status step progression
  const deliverySteps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', icon: CheckCircle2, desc: 'Ticket received by Ember & Spice' },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Executive Chef accepted order' },
    { status: 'preparing', label: 'In Kitchen Hearth', icon: ChefHat, desc: 'Woodfire embers grilling your selection' },
    { status: 'ready', label: 'Dishes Ready', icon: Utensils, desc: 'Inspected & packaged in thermal carriers' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'Courier en route to your address' },
    { status: 'delivered', label: 'Delivered', icon: MapPin, desc: 'Enjoy your handcrafted gourmet meal' },
  ];

  const dineInSteps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', icon: CheckCircle2, desc: 'Order sent to restaurant POS' },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Captain assigned to table' },
    { status: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chefs handcrafting your courses' },
    { status: 'ready', label: 'Plated', icon: Utensils, desc: 'Artisanal plating & garnish added' },
    { status: 'served', label: 'Served to Table', icon: Sparkles, desc: 'Served at your table with wine pairings' },
  ];

  const steps = isDineIn ? dineInSteps : deliverySteps;
  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  // Simulate next step for interactive demonstration
  const handleAdvanceStatus = () => {
    if (activeIndex < steps.length - 1 && onUpdateStatus) {
      const nextStatus = steps[activeIndex + 1].status;
      onUpdateStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Live Order Tracking
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-stone-100 flex items-center gap-2">
              Order #{order.orderNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close tracker"
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Estimated Time Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-stone-950 to-stone-900 border border-amber-500/20">
            <div>
              <div className="text-xs text-stone-400">
                {order.status === 'delivered' || order.status === 'served'
                  ? 'Order Completed'
                  : isDineIn
                  ? 'Estimated Serving Time'
                  : 'Estimated Delivery Time'}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2 mt-0.5">
                <Clock className="w-5 h-5 text-amber-500" />
                {order.status === 'delivered' || order.status === 'served'
                  ? 'Completed'
                  : `${order.estimatedTimeMinutes} Minutes`}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Animated Stepper Timeline */}
          <div className="space-y-4 py-2">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isFuture = idx > activeIndex;

              return (
                <div key={step.status} className="flex items-start gap-4 relative">
                  {/* Vertical connecting line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] transition-colors duration-500 ${
                        idx < activeIndex ? 'bg-amber-500' : 'bg-stone-800'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isPast
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : isCurrent
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30 animate-pulse'
                        : 'bg-stone-950 border border-stone-800 text-stone-600'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>

                  {/* Text Description */}
                  <div className="flex-1 pb-4">
                    <div
                      className={`text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-amber-400 font-bold'
                          : isPast
                          ? 'text-stone-200'
                          : 'text-stone-500'
                      }`}
                    >
                      {step.label}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Status Simulation Control */}
          {onUpdateStatus && activeIndex < steps.length - 1 && (
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Preview next workflow status:</span>
              <button
                onClick={handleAdvanceStatus}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Step: {steps[activeIndex + 1].label}</span>
              </button>
            </div>
          )}

          {/* Delivery or Dining Location details */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs space-y-2">
            <div className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">
              {isDineIn ? 'Dining Reservation Details' : 'Delivery Destination'}
            </div>
            {isDineIn ? (
              <div className="flex items-center justify-between text-stone-300">
                <span>Assigned Table: <strong className="text-amber-400">{order.tableNumber || 'Main Dining'}</strong></span>
                <span>Guest Name: <strong className="text-stone-100">{order.customerName}</strong></span>
              </div>
            ) : (
              <div className="text-stone-300 space-y-1">
                <p><strong>Address:</strong> {order.deliveryAddress?.address || '742 Evergreen Terrace'}</p>
                <p><strong>District:</strong> {order.deliveryAddress?.area || 'Culinary District'}, {order.deliveryAddress?.district || 'Metropolis'}</p>
                {order.deliveryAddress?.instructions && (
                  <p className="text-stone-400"><strong>Notes:</strong> {order.deliveryAddress.instructions}</p>
                )}
              </div>
            )}
          </div>

          {/* Ordered Food Items */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Dishes in this order ({order.items.length})
            </div>
            <div className="space-y-1.5">
              {order.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-stone-900 border border-stone-800 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                      {it.quantity}x
                    </span>
                    <div>
                      <span className="text-stone-200 font-medium">{it.name}</span>
                      {it.addons && it.addons.length > 0 && (
                        <div className="text-[10px] text-stone-400">
                          {it.addons.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
