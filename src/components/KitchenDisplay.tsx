import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle,
  AlertCircle,
  Utensils,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Flame,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onRefresh: () => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  orders,
  onUpdateOrderStatus,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  // Filter orders by kitchen workflow
  const activeOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'ready', 'served'].includes(o.status)
  );

  const filteredOrders = activeOrders.filter((o) => {
    if (filterType === 'all') return true;
    return o.orderType === filterType;
  });

  const columns: {
    status: OrderStatus;
    title: string;
    badgeColor: string;
    nextAction?: { label: string; nextStatus: OrderStatus; btnColor: string };
  }[] = [
    {
      status: 'placed',
      title: 'New Tickets',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      nextAction: { label: 'Accept Ticket', nextStatus: 'confirmed', btnColor: 'bg-blue-600 hover:bg-blue-500' },
    },
    {
      status: 'confirmed',
      title: 'Confirmed / Queued',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      nextAction: { label: 'Start Preparing', nextStatus: 'preparing', btnColor: 'bg-amber-600 hover:bg-amber-500' },
    },
    {
      status: 'preparing',
      title: 'On The Hearth / Cooking',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      nextAction: { label: 'Mark as Ready', nextStatus: 'ready', btnColor: 'bg-emerald-600 hover:bg-emerald-500' },
    },
    {
      status: 'ready',
      title: 'Plated & Ready for Service',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      nextAction: { label: 'Serve / Complete', nextStatus: 'served', btnColor: 'bg-stone-800 hover:bg-stone-700' },
    },
  ];

  // Helper to format elapsed minutes
  const getElapsedMinutes = (dateStr: string) => {
    const elapsed = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    return Math.max(1, elapsed);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 lg:p-8">
      {/* Top KDS Control Bar */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-600/30">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-wide text-stone-100">
                Kitchen Display System (KDS)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Feed
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Open Hearth & Expediter Station • {filteredOrders.length} active kitchen tickets
            </p>
          </div>
        </div>

        {/* Filter controls & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-900 border border-stone-800 rounded-xl p-1 text-xs">
            {['all', 'dine-in', 'delivery', 'takeaway'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  filterType === t
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs text-stone-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4-Column Board */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnOrders = filteredOrders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl bg-stone-900/60 border border-stone-800 p-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-stone-200">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeColor}`}>
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Order Cards Stream */}
              <div className="flex-1 space-y-3.5 overflow-y-auto">
                {columnOrders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-600">
                    No tickets in this stage
                  </div>
                ) : (
                  columnOrders.map((ord) => {
                    const elapsedMin = getElapsedMinutes(ord.createdAt);
                    const isUrgent = elapsedMin > 20;

                    return (
                      <div
                        key={ord.id}
                        className={`p-4 rounded-xl border transition-all text-left shadow-lg ${
                          isUrgent
                            ? 'bg-stone-950 border-rose-500/50 ring-1 ring-rose-500/30'
                            : 'bg-stone-950 border-stone-800/90'
                        }`}
                      >
                        {/* Header: Order ID & Timer */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              #{ord.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                ord.orderType === 'dine-in'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : ord.orderType === 'delivery'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}
                            >
                              {ord.orderType === 'dine-in'
                                ? `Table ${ord.tableNumber || '1'}`
                                : ord.orderType}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-stone-900 text-stone-400'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{elapsedMin}m</span>
                          </div>
                        </div>

                        {/* Customer Name */}
                        <div className="text-xs text-stone-400 mb-3">
                          Guest: <strong className="text-stone-200">{ord.customerName}</strong>
                        </div>

                        {/* Item List */}
                        <div className="space-y-2 py-2 border-y border-stone-900 my-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex items-baseline justify-between font-medium">
                                <span className="text-stone-100">
                                  <strong className="text-amber-400 mr-1.5 font-mono">{it.quantity}x</strong>
                                  {it.name}
                                </span>
                              </div>
                              {it.variant && (
                                <div className="text-[11px] text-amber-500/90 pl-5">
                                  • {it.variant}
                                </div>
                              )}
                              {it.addons && it.addons.length > 0 && (
                                <div className="text-[10px] text-stone-400 pl-5">
                                  + {it.addons.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Special instructions */}
                        {ord.specialInstructions && (
                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 my-2">
                            <strong>Note:</strong> {ord.specialInstructions}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {col.nextAction && (
                          <div className="pt-2">
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, col.nextAction!.nextStatus)}
                              className={`w-full py-2.5 px-3 rounded-xl text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                                col.nextAction.btnColor
                              }`}
                            >
                              <span>{col.nextAction.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
