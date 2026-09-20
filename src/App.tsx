import React, { useState, useEffect } from 'react';
import {
  FoodItem,
  CartItem,
  Order,
  Reservation,
  RestaurantTable,
  Coupon,
  Review,
  RestaurantSettings,
  OrderStatus,
  TableStatus,
  AppNotification,
  FoodAddon,
  FoodVariant,
} from './types.ts';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { ReservationSection } from './components/ReservationSection.tsx';
import { StorySection } from './components/StorySection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { Footer } from './components/Footer.tsx';
import { FoodDetailModal } from './components/FoodDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderTrackerModal } from './components/OrderTrackerModal.tsx';
import { CustomerDashboard } from './components/CustomerDashboard.tsx';
import { KitchenDisplay } from './components/KitchenDisplay.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';

import { Flame, ShieldCheck, Award } from 'lucide-react';

export default function App() {
  // Navigation View
  const [currentView, setCurrentView] = useState<
    'home' | 'menu' | 'story' | 'reservations' | 'gallery' | 'contact' | 'kitchen' | 'admin' | 'account'
  >('home');

  // Core Data States
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  // User Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<FoodItem[]>([INITIAL_FOOD_ITEMS[0], INITIAL_FOOD_ITEMS[3]]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; description?: string } | null>(null);

  // Modals
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Load from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMenu, resOrders, resReservations, resTables, resCoupons, resReviews, resSettings] =
          await Promise.allSettled([
            fetch('/api/menu').then((r) => r.json()),
            fetch('/api/orders').then((r) => r.json()),
            fetch('/api/reservations').then((r) => r.json()),
            fetch('/api/tables').then((r) => r.json()),
            fetch('/api/coupons').then((r) => r.json()),
            fetch('/api/reviews').then((r) => r.json()),
            fetch('/api/settings').then((r) => r.json()),
          ]);

        if (resMenu.status === 'fulfilled' && resMenu.value?.success) setFoodItems(resMenu.value.data);
        if (resOrders.status === 'fulfilled' && resOrders.value?.success) setOrders(resOrders.value.data);
        if (resReservations.status === 'fulfilled' && resReservations.value?.success) setReservations(resReservations.value.data);
        if (resTables.status === 'fulfilled' && resTables.value?.success) setTables(resTables.value.data);
        if (resCoupons.status === 'fulfilled' && resCoupons.value?.success) setCoupons(resCoupons.value.data);
        if (resReviews.status === 'fulfilled' && resReviews.value?.success) setReviews(resReviews.value.data);
        if (resSettings.status === 'fulfilled' && resSettings.value?.success) setSettings(resSettings.value.data);
      } catch (err) {
        console.warn('Backend API loaded with client fallback');
      }
    };
    fetchData();
  }, []);

  // Cart operations
  const handleAddToCart = (
    item: FoodItem,
    quantity = 1,
    addons: FoodAddon[] = [],
    variant?: FoodVariant,
    specialInstructions?: string
  ) => {
    const variantPrice = variant ? variant.priceDelta : 0;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const itemPrice = item.price + variantPrice + addonsTotal;

    const existingIndex = cartItems.findIndex(
      (c) =>
        c.food.id === item.id &&
        c.selectedVariant?.id === variant?.id &&
        JSON.stringify(c.selectedAddons.map((a) => a.id).sort()) ===
          JSON.stringify(addons.map((a) => a.id).sort())
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        foodId: item.id,
        food: item,
        quantity,
        selectedAddons: addons,
        selectedVariant: variant,
        specialInstructions,
        itemPrice,
      };
      setCartItems((prev) => [...prev, newCartItem]);
    }
  };

  const handleQuickAdd = (item: FoodItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(item, 1);
  };

  const handleBuyNow = (
    item: FoodItem,
    quantity = 1,
    addons: FoodAddon[] = [],
    variant?: FoodVariant,
    specialInstructions?: string
  ) => {
    handleAddToCart(item, quantity, addons, variant, specialInstructions);
    setSelectedFoodItem(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Coupon Verification
  const handleApplyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const subtotal = cartItems.reduce((sum, it) => sum + it.itemPrice * it.quantity, 0);
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.data.code,
          discountAmount: data.data.discountAmount,
          description: data.data.description,
        });
        return { success: true, message: 'Coupon applied successfully!' };
      }
      return { success: false, message: data.message || 'Invalid promotion code' };
    } catch {
      // Local fallback
      const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
      if (found) {
        const subtotal = cartItems.reduce((sum, it) => sum + it.itemPrice * it.quantity, 0);
        const disc =
          found.discountType === 'percentage'
            ? Number(((subtotal * found.value) / 100).toFixed(2))
            : found.value;
        setAppliedCoupon({ code: found.code, discountAmount: disc });
        return { success: true, message: 'Coupon applied!' };
      }
      return { success: false, message: 'Invalid promotion code' };
    }
  };

  // Wishlist toggle
  const handleToggleWishlist = (item: FoodItem) => {
    if (wishlist.some((w) => w.id === item.id)) {
      setWishlist((prev) => prev.filter((w) => w.id !== item.id));
    } else {
      setWishlist((prev) => [...prev, item]);
    }
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Order #${newOrder.orderNumber} Confirmed`,
        message: `Our kitchen has accepted your order of $${newOrder.total.toFixed(2)}. Tracking is live.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'order',
      },
      ...prev,
    ]);
  };

  // Reservation Creation
  const handleReservationCreated = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Table Reserved: ${newRes.reservationNumber}`,
        message: `Table confirmed for ${newRes.guests} guests on ${newRes.date} at ${newRes.time}.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'reservation',
      },
      ...prev,
    ]);
  };

  // Update order status across system
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Table Status Update (Floor Plan)
  const handleUpdateTableStatus = async (tableId: string, newStatus: TableStatus) => {
    try {
      await fetch(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
    );
  };

  // Reservation Status
  const handleUpdateReservationStatus = async (resId: string, status: any, table?: string) => {
    try {
      await fetch(`/api/reservations/${resId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tableNumber: table }),
      });
    } catch (e) {
      console.error(e);
    }
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status, tableNumber: table || r.tableNumber } : r))
    );
  };

  // Menu Modifications
  const handleAddFood = (foodData: Partial<FoodItem>) => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodData.name || 'New Gourmet Dish',
      category: foodData.category || 'Main Course',
      price: foodData.price || 30,
      description: foodData.description || 'Artisanal dish with seasonal pairings.',
      image: foodData.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 12,
      prepTime: foodData.prepTime || '20 mins',
      calories: foodData.calories || 500,
      isChefSpecial: foodData.isChefSpecial || false,
      isPopular: foodData.isPopular || false,
      isVeg: foodData.isVeg || false,
      isSpicy: foodData.isSpicy || false,
      isAvailable: true,
      allergens: foodData.allergens || ['Dairy'],
      ingredients: ['Heritage Produce', 'Sea Salt', 'Virgin Olive Oil'],
    };
    setFoodItems((prev) => [newItem, ...prev]);
  };

  const handleEditFood = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteFood = (id: string) => {
    setFoodItems((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCreateCoupon = (couponData: Partial<Coupon>) => {
    const newCpn: Coupon = {
      id: `cpn-${Date.now()}`,
      code: couponData.code?.toUpperCase() || 'SPECIAL15',
      discountType: couponData.discountType || 'percentage',
      value: couponData.value || 15,
      minOrder: couponData.minOrder || 50,
      expiryDate: couponData.expiryDate || '2026-12-31',
      usageLimit: 100,
      usageCount: 0,
      active: true,
      description: couponData.description || 'Special promo code for diners.',
    };
    setCoupons((prev) => [newCpn, ...prev]);
  };

  const handleAddReview = async (revData: Partial<Review>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revData),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [data.data, ...prev]);
      }
    } catch {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        customerName: revData.customerName || 'Anonymous Guest',
        rating: revData.rating || 5,
        comment: revData.comment || 'Remarkable culinary ambiance!',
        foodName: revData.foodName,
        date: new Date().toISOString(),
        verified: true,
      };
      setReviews((prev) => [newRev, ...prev]);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Fixed Luxury Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        settings={settings}
        onSearchClick={() => {
          setCurrentView('menu');
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW: KITCHEN DISPLAY SYSTEM */}
        {currentView === 'kitchen' && (
          <KitchenDisplay
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRefresh={() => {}}
          />
        )}

        {/* VIEW: RESTAURANT ADMIN MANAGEMENT */}
        {currentView === 'admin' && (
          <AdminDashboard
            foodItems={foodItems}
            orders={orders}
            reservations={reservations}
            tables={tables}
            coupons={coupons}
            reviews={reviews}
            settings={settings}
            onUpdateSettings={setSettings}
            onAddFood={handleAddFood}
            onEditFood={handleEditFood}
            onDeleteFood={handleDeleteFood}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onUpdateTableStatus={handleUpdateTableStatus}
            onCreateCoupon={handleCreateCoupon}
          />
        )}

        {/* VIEW: MAIN GUEST DINING (Home, Menu, Story, Reservations, Gallery, Contact) */}
        {!['kitchen', 'admin'].includes(currentView) && (
          <div>
            {/* 3D Hero Section (Shown on Home view) */}
            {currentView === 'home' && (
              <>
                <HeroSection
                  settings={settings}
                  onExploreMenu={() => {
                    const el = document.getElementById('menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onReserveTable={() => {
                    const el = document.getElementById('reservations');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOrderOnline={() => {
                    const el = document.getElementById('menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Chef's Signature Feature Ribbon */}
                <div className="border-y border-stone-800/80 bg-stone-900/60 py-6 px-4">
                  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs text-stone-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-100 text-sm">White Oak Embers</div>
                        <div className="text-[11px] text-stone-400">Authentic woodfire hearth technique</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-100 text-sm">A5 Miyazaki Wagyu & Truffles</div>
                        <div className="text-[11px] text-stone-400">Certified origin & weekly imports</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-100 text-sm">Thermal Insulated Delivery</div>
                        <div className="text-[11px] text-stone-400">Arrives piping hot from our hearth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Culinary Menu Section */}
            {(currentView === 'home' || currentView === 'menu') && (
              <MenuSection
                foodItems={foodItems}
                onSelectItem={(item) => setSelectedFoodItem(item)}
                onAddToCart={handleQuickAdd}
              />
            )}

            {/* Table Reservations Section */}
            {(currentView === 'home' || currentView === 'reservations') && (
              <ReservationSection onReservationCreated={handleReservationCreated} />
            )}

            {/* Story & Philosophy Section */}
            {(currentView === 'home' || currentView === 'story') && (
              <StorySection />
            )}

            {/* Visual Photography Gallery */}
            {(currentView === 'home' || currentView === 'gallery') && (
              <GallerySection />
            )}

            {/* Critic & Guest Reviews */}
            {(currentView === 'home' || currentView === 'story' || currentView === 'menu') && (
              <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />
            )}

            {/* Footer */}
            <Footer
              settings={settings}
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* GLOBAL MODALS & DRAWERS */}
      {/* ============================================================== */}

      {/* 1. Food Detail Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedFoodItem ? wishlist.some((w) => w.id === selectedFoodItem.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Cart Slide-Out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={() => setAppliedCoupon(null)}
        settings={settings}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
        appliedCoupon={appliedCoupon}
        settings={settings}
        onOpenTracker={(order) => setActiveTrackingOrder(order)}
      />

      {/* 4. Real-time Order Tracker Modal */}
      <OrderTrackerModal
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* 5. Customer Profile & Account Modal */}
      <CustomerDashboard
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        reservations={reservations}
        wishlist={wishlist}
        coupons={coupons}
        onTrackOrder={(order) => {
          setActiveTrackingOrder(order);
          setIsAccountOpen(false);
        }}
        onAddToCart={(item) => {
          handleAddToCart(item);
          setIsCartOpen(true);
        }}
        onRemoveFromWishlist={handleToggleWishlist}
        onCancelReservation={(id) => handleUpdateReservationStatus(id, 'cancelled')}
      />

      {/* 6. Notifications Slide-out Panel */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />
    </div>
  );
}
