import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Grid,
  Tag,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit,
  Search,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  FoodItem,
  Order,
  Reservation,
  RestaurantTable,
  Coupon,
  Review,
  RestaurantSettings,
  OrderStatus,
  TableStatus,
} from '../types.ts';

interface AdminDashboardProps {
  foodItems: FoodItem[];
  orders: Order[];
  reservations: Reservation[];
  tables: RestaurantTable[];
  coupons: Coupon[];
  reviews: Review[];
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: RestaurantSettings) => void;
  onAddFood: (food: Partial<FoodItem>) => void;
  onEditFood: (id: string, updates: Partial<FoodItem>) => void;
  onDeleteFood: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateReservationStatus: (resId: string, status: any, table?: string) => void;
  onUpdateTableStatus: (tableId: string, status: TableStatus) => void;
  onCreateCoupon: (coupon: Partial<Coupon>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  foodItems,
  orders,
  reservations,
  tables,
  coupons,
  reviews,
  settings,
  onUpdateSettings,
  onAddFood,
  onEditFood,
  onDeleteFood,
  onUpdateOrderStatus,
  onUpdateReservationStatus,
  onUpdateTableStatus,
  onCreateCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'orders' | 'menu' | 'tables' | 'reservations' | 'coupons' | 'settings'
  >('analytics');

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [menuSearch, setMenuSearch] = useState('');

  // Modals for Adding Food
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '',
    category: 'Main Course',
    price: 32,
    description: '',
    calories: 550,
    prepTime: '20 mins',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: false,
    isPopular: false,
    isVeg: false,
    isSpicy: false,
  });

  // Modal for Adding Coupon
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    value: 15,
    minOrder: 50,
    expiryDate: '2026-12-31',
    description: '',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Derived Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => ['placed', 'confirmed', 'preparing'].includes(o.status)).length;
  const completedOrdersCount = orders.filter((o) => ['delivered', 'served'].includes(o.status)).length;
  const activeReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price) return;
    onAddFood(newFood);
    setShowAddFoodModal(false);
    setNewFood({
      name: '',
      category: 'Main Course',
      price: 32,
      description: '',
      calories: 550,
      prepTime: '20 mins',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    });
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;
    onCreateCoupon(newCoupon);
    setShowAddCouponModal(false);
    setNewCoupon({ code: '', discountType: 'percentage', value: 15, minOrder: 50 });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-stone-800 bg-stone-900/70 backdrop-blur-xl px-6 py-4 sticky top-0 z-30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-stone-100">
              {settings.brandName} Executive Control
            </h1>
            <p className="text-xs text-stone-400">
              Restaurant Management, Real-time Operations & Analytics
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-2xl border border-stone-800 text-xs overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, count: pendingOrdersCount },
            { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
            { id: 'tables', label: 'Floor Plan', icon: Grid },
            { id: 'reservations', label: 'Reservations', icon: Calendar, count: activeReservationsCount },
            { id: 'coupons', label: 'Promotions', icon: Tag },
            { id: 'settings', label: 'Branding', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-stone-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 text-left space-y-6">
        {/* ============================================================== */}
        {/* 1. ANALYTICS & STATS VIEW */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Gross Sales (Live)</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">
                  ${totalRevenue.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +18.4% from last period
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Total Orders Placed</span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-100 font-display">
                  {orders.length}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  {pendingOrdersCount} in kitchen • {completedOrdersCount} fulfilled
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Confirmed Bookings</span>
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-100 font-display">
                  {activeReservationsCount}
                </div>
                <div className="text-[11px] text-purple-300 mt-1">
                  92% weekend occupancy
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span>Floor Utilization</span>
                  <Grid className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-100 font-display">
                  {tables.filter((t) => t.status === 'occupied').length} / {tables.length}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Active dining tables seated
                </div>
              </div>
            </div>

            {/* Weekly Revenue Visual Chart Bars */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-semibold text-base text-stone-100">
                    Weekly Revenue & Order Volume
                  </h3>
                  <p className="text-xs text-stone-400">Peak dining revenue recorded Friday & Saturday evening</p>
                </div>
                <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Current Week: $22,870
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="grid grid-cols-7 gap-3 h-48 items-end pt-8 pb-2">
                {[
                  { day: 'Mon', revenue: 1420, height: '24%' },
                  { day: 'Tue', revenue: 1890, height: '32%' },
                  { day: 'Wed', revenue: 2150, height: '36%' },
                  { day: 'Thu', revenue: 2680, height: '45%' },
                  { day: 'Fri', revenue: 4320, height: '73%' },
                  { day: 'Sat', revenue: 5890, height: '95%' },
                  { day: 'Sun', revenue: 4940, height: '84%' },
                ].map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      ${bar.revenue}
                    </span>
                    <div
                      style={{ height: bar.height }}
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-amber-700 to-amber-500 group-hover:from-amber-600 group-hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-600/10"
                    />
                    <span className="text-xs text-stone-300 font-semibold">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Dishes & Customer Ratings Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800">
                <h3 className="font-display font-semibold text-base text-stone-100 mb-4">
                  Top Selling Signature Dishes
                </h3>
                <div className="space-y-3">
                  {foodItems.slice(0, 5).map((dish, i) => (
                    <div key={dish.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/70 border border-stone-800/80">
                      <div className="flex items-center gap-3">
                        <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="text-xs font-semibold text-stone-100 line-clamp-1">{dish.name}</div>
                          <div className="text-[11px] text-amber-500">{dish.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-400">${dish.price.toFixed(2)}</div>
                        <div className="text-[10px] text-stone-400">{85 - i * 14} sold this week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Feedback Moderation */}
              <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800">
                <h3 className="font-display font-semibold text-base text-stone-100 mb-4">
                  Recent Guest Reviews
                </h3>
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-200">{rev.customerName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, r) => (
                            <Star key={r} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-400 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ORDER MANAGEMENT VIEW */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">Live Orders & Receipts</h2>
                <p className="text-xs text-stone-400">Filter, search, and update order statuses across all dining channels</p>
              </div>

              {/* Search & Filters */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search by Order # or Customer"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="served">Served</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-3xl border border-stone-800 bg-stone-900/60 shadow-xl">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[11px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-5 py-3.5">Order</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Items</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {orders
                    .filter((o) => {
                      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                      if (orderSearch) {
                        const q = orderSearch.toLowerCase();
                        return (
                          o.orderNumber.toLowerCase().includes(q) ||
                          o.customerName.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-900/80 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-amber-400">
                          #{ord.orderNumber}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-stone-100">{ord.customerName}</div>
                          <div className="text-[10px] text-stone-500">{ord.customerPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            {ord.orderType === 'dine-in' ? `Table ${ord.tableNumber || '1'}` : ord.orderType}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-stone-300">{ord.items.length} items</span>
                          <div className="text-[10px] text-stone-500 line-clamp-1">
                            {ord.items.map((i) => i.name).join(', ')}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-amber-400">
                          ${ord.total.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ['delivered', 'served'].includes(ord.status)
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-[11px] text-stone-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="served">Served</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. MENU CATALOG MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">Menu & Dish Management</h2>
                <p className="text-xs text-stone-400">Add, edit, or adjust pricing and ingredients across all categories</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={() => setShowAddFoodModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems
                .filter((f) => !menuSearch || f.name.toLowerCase().includes(menuSearch.toLowerCase()))
                .map((food) => (
                  <div
                    key={food.id}
                    className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex gap-4 items-start group"
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-20 h-20 rounded-xl object-cover bg-stone-950 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display font-semibold text-sm text-stone-100 truncate">
                          {food.name}
                        </h4>
                        <button
                          onClick={() => onDeleteFood(food.id)}
                          aria-label="Delete food"
                          className="text-stone-600 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-amber-500 font-medium">{food.category}</div>
                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{food.description}</p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-800">
                        <span className="font-bold text-amber-400 text-sm">${food.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditFood(food.id, { isAvailable: !food.isAvailable })}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              food.isAvailable
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-stone-900 text-stone-500 border-stone-800'
                            }`}
                          >
                            {food.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. RESTAURANT TABLES & VISUAL FLOOR PLAN */}
        {/* ============================================================== */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">
                  Interactive Dining Floor Plan
                </h2>
                <p className="text-xs text-stone-400">
                  Click any table to dynamically toggle between Available, Reserved, Occupied, and Cleaning
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Available
                </span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Reserved
                </span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Occupied
                </span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-3 h-3 rounded-full bg-blue-500" /> Cleaning
                </span>
              </div>
            </div>

            {/* Visual Floor Plan Grid Map */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl relative min-h-[460px] overflow-hidden">
              {/* Floor Plan Zones Ambient Markers */}
              <div className="absolute top-4 left-6 text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Window Alcoves
              </div>
              <div className="absolute top-4 right-6 text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Garden Terrace
              </div>
              <div className="absolute bottom-4 left-6 text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Open Hearth Kitchen
              </div>
              <div className="absolute bottom-4 right-6 text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Mezzanine VIP Vault
              </div>

              {/* Grid of Tables */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-8">
                {tables.map((tbl) => {
                  const statusColors: Record<TableStatus, { bg: string; border: string; text: string }> = {
                    available: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/50', text: 'text-emerald-300' },
                    reserved: { bg: 'bg-amber-950/40', border: 'border-amber-500/50', text: 'text-amber-300' },
                    occupied: { bg: 'bg-rose-950/40', border: 'border-rose-500/50', text: 'text-rose-300' },
                    cleaning: { bg: 'bg-blue-950/40', border: 'border-blue-500/50', text: 'text-blue-300' },
                    unavailable: { bg: 'bg-stone-950', border: 'border-stone-800', text: 'text-stone-500' },
                  };

                  const current = statusColors[tbl.status];

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => {
                        const statusCycle: TableStatus[] = ['available', 'reserved', 'occupied', 'cleaning'];
                        const nextIdx = (statusCycle.indexOf(tbl.status) + 1) % statusCycle.length;
                        onUpdateTableStatus(tbl.id, statusCycle[nextIdx]);
                      }}
                      className={`p-4 rounded-2xl border ${current.border} ${current.bg} cursor-pointer transition-all hover:scale-103 active:scale-97 flex flex-col justify-between shadow-lg`}
                      title="Click to cycle status"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm text-stone-100">{tbl.number}</span>
                        <span className="text-[10px] font-semibold text-stone-400">{tbl.capacity} Seats</span>
                      </div>

                      <div className="text-xs font-medium text-stone-200 line-clamp-1 mb-1">{tbl.name}</div>
                      <div className="text-[10px] text-stone-400 mb-3">{tbl.location}</div>

                      <div className={`mt-auto text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded-lg text-center ${current.bg} ${current.text} border ${current.border}`}>
                        {tbl.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. RESERVATION MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">Guest Reservations</h2>
                <p className="text-xs text-stone-400">Review, seat, and allocate tables for incoming reservations</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-stone-800 bg-stone-900/60 shadow-xl">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[11px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-5 py-3.5">Ticket</th>
                    <th className="px-5 py-3.5">Guest</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Party</th>
                    <th className="px-5 py-3.5">Assigned Table</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {reservations.map((resv) => (
                    <tr key={resv.id} className="hover:bg-stone-900/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-amber-400">
                        {resv.reservationNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-100">{resv.customerName}</div>
                        <div className="text-[10px] text-stone-500">{resv.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-stone-200">{resv.date}</div>
                        <div className="text-[10px] text-amber-500">{resv.time}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold">{resv.guests} Guests</span>
                        <div className="text-[10px] text-stone-500 capitalize">{resv.tableType}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-amber-400">
                        {resv.tableNumber || 'Unassigned'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            resv.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : resv.status === 'seated'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {resv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {resv.status === 'pending' && (
                          <button
                            onClick={() => onUpdateReservationStatus(resv.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {resv.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateReservationStatus(resv.id, 'seated')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]"
                          >
                            Seat Guests
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateReservationStatus(resv.id, 'cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. PROMOTIONS & COUPONS */}
        {/* ============================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">Offers & Promo Codes</h2>
                <p className="text-xs text-stone-400">Configure discount incentives, first-order bonuses, and minimum order rules</p>
              </div>

              <button
                onClick={() => setShowAddCouponModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((cpn) => (
                <div key={cpn.id} className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-base text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                        {cpn.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    </div>

                    <div className="text-lg font-bold text-stone-100 mt-2">
                      {cpn.discountType === 'percentage' ? `${cpn.value}% Off` : `$${cpn.value} Flat Off`}
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{cpn.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Minimum Order</span>
                      <span className="text-stone-200 font-semibold">${cpn.minOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage Count</span>
                      <span className="text-amber-400 font-semibold">{cpn.usageCount} / {cpn.usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires</span>
                      <span className="text-stone-300">{cpn.expiryDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. RESTAURANT BRANDING & SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-stone-100">Restaurant Settings & Brand Identity</h2>
                <p className="text-xs text-stone-400">Update restaurant name, hours, tax policies, and delivery configurations instantly</p>
              </div>

              {settingsSavedMessage && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Settings Saved</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Restaurant Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Weekday Hours</label>
                <input
                  type="text"
                  value={settingsForm.openingHours.weekdays}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      openingHours: { ...settingsForm.openingHours, weekdays: e.target.value },
                    })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Weekend Hours</label>
                <input
                  type="text"
                  value={settingsForm.openingHours.weekends}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      openingHours: { ...settingsForm.openingHours, weekends: e.target.value },
                    })
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Delivery Fee ($)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settingsForm.deliveryFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsForm.taxRatePercent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, taxRatePercent: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Add Food Modal */}
      {showAddFoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateDish} className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-display font-bold text-lg text-stone-100">Add New Culinary Dish</h3>
              <button type="button" onClick={() => setShowAddFoodModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Dish Name</label>
              <input
                type="text"
                required
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                placeholder="e.g. Dry Aged Porterhouse"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Category</label>
                <select
                  value={newFood.category}
                  onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                >
                  <option value="Steak & Woodfire">Steak & Woodfire</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Artisan Pizza">Artisan Pizza</option>
                  <option value="Gourmet Burgers">Gourmet Burgers</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newFood.price}
                  onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={newFood.description}
                onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                placeholder="Flavors, preparation, and presentation details..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Photo Image URL</label>
              <input
                type="url"
                value={newFood.image}
                onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-300 pt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.isChefSpecial}
                  onChange={(e) => setNewFood({ ...newFood, isChefSpecial: e.target.checked })}
                />
                Chef's Special
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.isVeg}
                  onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
                />
                Vegetarian
              </label>
            </div>

            <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddFoodModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateCouponSubmit} className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-display font-bold text-lg text-stone-100">Create Promotion Code</h3>
              <button type="button" onClick={() => setShowAddCouponModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="e.g. VIP25"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Discount Type</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Minimum Order Subtotal ($)</label>
              <input
                type="number"
                value={newCoupon.minOrder}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Description / Benefit</label>
              <input
                type="text"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                placeholder="e.g. 20% off all dinners over $75"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
              />
            </div>

            <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Activate Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
