import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CATEGORIES,
  INITIAL_FOOD_ITEMS,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
} from './src/data/mockData.ts';
import {
  FoodItem,
  Order,
  Reservation,
  RestaurantTable,
  Coupon,
  Review,
  RestaurantSettings,
  AppNotification,
  MenuCategory,
} from './src/types.ts';

// In-Memory Database Store for Runtime
let categories: MenuCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
let foodItems: FoodItem[] = JSON.parse(JSON.stringify(INITIAL_FOOD_ITEMS));
let tables: RestaurantTable[] = JSON.parse(JSON.stringify(INITIAL_TABLES));
let coupons: Coupon[] = JSON.parse(JSON.stringify(INITIAL_COUPONS));
let reviews: Review[] = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
let orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let reservations: Reservation[] = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
let settings: RestaurantSettings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
let notifications: AppNotification[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // REST API Routes
  // -------------------------------------------------------------

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: settings.brandName, timestamp: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json({ success: true, data: settings });
  });

  app.put('/api/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    // Enrich with item counts
    const enriched = categories.map((cat) => ({
      ...cat,
      count: foodItems.filter((f) => f.category.toLowerCase() === cat.name.toLowerCase()).length,
    }));
    res.json({ success: true, data: enriched });
  });

  app.post('/api/categories', (req, res) => {
    const { name, slug, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const newCategory: MenuCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || 'UtensilsCrossed',
      description: description || '',
    };
    categories.push(newCategory);
    res.status(201).json({ success: true, data: newCategory });
  });

  // Food Menu Items
  app.get('/api/menu', (req, res) => {
    const { category, search, veg, spicy, popular, chefSpecial } = req.query;
    let filtered = [...foodItems];

    if (category && category !== 'all') {
      filtered = filtered.filter(
        (f) => f.category.toLowerCase() === (category as string).toLowerCase()
      );
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }
    if (veg === 'true') {
      filtered = filtered.filter((f) => f.isVeg);
    }
    if (spicy === 'true') {
      filtered = filtered.filter((f) => f.isSpicy);
    }
    if (popular === 'true') {
      filtered = filtered.filter((f) => f.isPopular);
    }
    if (chefSpecial === 'true') {
      filtered = filtered.filter((f) => f.isChefSpecial);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  });

  app.get('/api/menu/:id', (req, res) => {
    const item = foodItems.find((f) => f.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, data: item });
  });

  app.post('/api/menu', (req, res) => {
    const body = req.body;
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: body.name || 'Untitled Dish',
      category: body.category || 'Main Course',
      description: body.description || '',
      price: Number(body.price) || 25,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      image: body.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      isSpicy: !!body.isSpicy,
      spiceLevel: body.spiceLevel || 0,
      isVeg: !!body.isVeg,
      isVegan: !!body.isVegan,
      isPopular: !!body.isPopular,
      isNew: true,
      isChefSpecial: !!body.isChefSpecial,
      calories: Number(body.calories) || 500,
      prepTime: body.prepTime || '20 mins',
      allergens: body.allergens || [],
      ingredients: body.ingredients || [],
      addons: body.addons || [],
      variants: body.variants || [],
      isAvailable: body.isAvailable !== false,
    };
    foodItems.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/menu/:id', (req, res) => {
    const idx = foodItems.findIndex((f) => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    foodItems[idx] = { ...foodItems[idx], ...req.body };
    res.json({ success: true, data: foodItems[idx] });
  });

  app.delete('/api/menu/:id', (req, res) => {
    const idx = foodItems.findIndex((f) => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    foodItems.splice(idx, 1);
    res.json({ success: true, message: 'Item deleted' });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const { status, type, email } = req.query;
    let list = [...orders];
    if (status && status !== 'all') {
      list = list.filter((o) => o.status === status);
    }
    if (type && type !== 'all') {
      list = list.filter((o) => o.orderType === type);
    }
    if (email) {
      list = list.filter((o) => o.customerEmail.toLowerCase() === (email as string).toLowerCase());
    }
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: list.length, data: list });
  });

  app.post('/api/orders', (req, res) => {
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      tableNumber,
      deliveryAddress,
      items,
      paymentMethod,
      couponCode,
      specialInstructions,
    } = req.body;

    if (!customerName || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required order details' });
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);

    let discount = 0;
    if (couponCode) {
      const cpn = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
      if (cpn && subtotal >= cpn.minOrder) {
        if (cpn.discountType === 'percentage') {
          discount = (subtotal * cpn.value) / 100;
          if (cpn.maxDiscount && discount > cpn.maxDiscount) {
            discount = cpn.maxDiscount;
          }
        } else {
          discount = cpn.value;
        }
        cpn.usageCount += 1;
      }
    }

    const deliveryFee = orderType === 'delivery' ? (subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee) : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number(((taxableAmount * settings.taxRatePercent) / 100).toFixed(2));
    const total = Number((taxableAmount + deliveryFee + tax).toFixed(2));

    const orderNumber = `ES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail: customerEmail || 'guest@emberspice.com',
      customerPhone: customerPhone || '+1 (555) 000-0000',
      orderType: orderType || 'delivery',
      tableNumber,
      deliveryAddress,
      items,
      subtotal,
      discount,
      couponCode,
      deliveryFee,
      tax,
      total,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      specialInstructions,
      estimatedTimeMinutes: orderType === 'delivery' ? 35 : 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    // Push notification for order
    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `New Order Received (${orderNumber})`,
      message: `${customerName} placed a ${orderType} order for ${settings.currencySymbol}${total.toFixed(2)}.`,
      type: 'order',
      timestamp: 'Just now',
      read: false,
      actionUrl: `/tracker?order=${orderNumber}`,
    });

    res.status(201).json({ success: true, data: newOrder });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'delivered' || status === 'served') {
      order.paymentStatus = 'paid';
    }

    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Order ${order.orderNumber} Status Updated`,
      message: `Your order is now ${status.replace('_', ' ').toUpperCase()}.`,
      type: 'order',
      timestamp: 'Just now',
      read: false,
    });

    res.json({ success: true, data: order });
  });

  // Table Reservations
  app.get('/api/reservations', (req, res) => {
    const { date, status } = req.query;
    let list = [...reservations];
    if (date) {
      list = list.filter((r) => r.date === date);
    }
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: list.length, data: list });
  });

  app.post('/api/reservations', (req, res) => {
    const { customerName, customerEmail, customerPhone, date, time, guests, tableType, specialRequest } = req.body;
    if (!customerName || !date || !time) {
      return res.status(400).json({ success: false, message: 'Missing reservation details' });
    }

    // Auto-match an available table
    const matchingTable = tables.find(
      (t) => (t.type === tableType || !tableType) && t.capacity >= (Number(guests) || 2) && t.status === 'available'
    );

    const reservationNumber = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      guests: Number(guests) || 2,
      tableType: tableType || 'indoor',
      tableNumber: matchingTable ? matchingTable.number : undefined,
      specialRequest,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    if (matchingTable) {
      matchingTable.status = 'reserved';
    }

    reservations.unshift(newRes);

    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Table Reserved (${reservationNumber})`,
      message: `${customerName} booked ${newRes.guests} guests for ${date} at ${time}.`,
      type: 'reservation',
      timestamp: 'Just now',
      read: false,
    });

    res.status(201).json({ success: true, data: newRes });
  });

  app.patch('/api/reservations/:id/status', (req, res) => {
    const { status, tableNumber } = req.body;
    const resv = reservations.find((r) => r.id === req.params.id || r.reservationNumber === req.params.id);
    if (!resv) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    resv.status = status;
    if (tableNumber) {
      resv.tableNumber = tableNumber;
    }
    res.json({ success: true, data: resv });
  });

  // Restaurant Tables (Floor Plan)
  app.get('/api/tables', (req, res) => {
    res.json({ success: true, data: tables });
  });

  app.patch('/api/tables/:id/status', (req, res) => {
    const { status } = req.body;
    const tbl = tables.find((t) => t.id === req.params.id || t.number === req.params.id);
    if (!tbl) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    tbl.status = status;
    res.json({ success: true, data: tbl });
  });

  // Coupons
  app.get('/api/coupons', (req, res) => {
    res.json({ success: true, data: coupons });
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }
    const cpn = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!cpn) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
    }
    if (subtotal < cpn.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least ${settings.currencySymbol}${cpn.minOrder} to use this coupon`,
      });
    }

    let discount = 0;
    if (cpn.discountType === 'percentage') {
      discount = (subtotal * cpn.value) / 100;
      if (cpn.maxDiscount && discount > cpn.maxDiscount) {
        discount = cpn.maxDiscount;
      }
    } else {
      discount = cpn.value;
    }

    res.json({
      success: true,
      data: {
        code: cpn.code,
        discountType: cpn.discountType,
        value: cpn.value,
        discountAmount: Number(discount.toFixed(2)),
        description: cpn.description,
      },
    });
  });

  app.post('/api/coupons', (req, res) => {
    const { code, discountType, value, minOrder, maxDiscount, expiryDate, usageLimit, description } = req.body;
    if (!code || !value) {
      return res.status(400).json({ success: false, message: 'Code and discount value required' });
    }
    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountType: discountType || 'percentage',
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiryDate: expiryDate || '2026-12-31',
      usageLimit: Number(usageLimit) || 100,
      usageCount: 0,
      active: true,
      description: description || `${value}% discount coupon`,
    };
    coupons.push(newCoupon);
    res.status(201).json({ success: true, data: newCoupon });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { customerName, rating, comment, foodName } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Name, rating and review text required' });
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName,
      rating: Number(rating),
      comment,
      foodName: foodName || 'Artisanal Dining Experience',
      date: 'Just now',
      verified: true,
    };
    reviews.unshift(newReview);
    res.status(201).json({ success: true, data: newReview });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    res.json({ success: true, data: notifications });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  app.post('/api/notifications/clear', (req, res) => {
    notifications.forEach((n) => (n.read = true));
    res.json({ success: true });
  });

  // Admin & Kitchen Analytics
  app.get('/api/analytics', (req, res) => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => ['placed', 'confirmed', 'preparing'].includes(o.status)).length;
    const completedOrders = orders.filter((o) => ['delivered', 'served'].includes(o.status)).length;
    const activeReservations = reservations.filter((r) => r.status === 'confirmed').length;

    // Daily volume series (simulated 7 days)
    const dailyVolume = [
      { day: 'Mon', revenue: 1420, orders: 18 },
      { day: 'Tue', revenue: 1890, orders: 24 },
      { day: 'Wed', revenue: 2150, orders: 28 },
      { day: 'Thu', revenue: 2680, orders: 32 },
      { day: 'Fri', revenue: 4320, orders: 54 },
      { day: 'Sat', revenue: 5890, orders: 72 },
      { day: 'Sun', revenue: 4940, orders: 61 },
    ];

    const popularDishes = foodItems
      .slice(0, 5)
      .map((f, i) => ({ name: f.name, orders: 85 - i * 12, rating: f.rating, revenue: (85 - i * 12) * f.price }));

    res.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        todayOrders: orders.length + 14,
        pendingOrders,
        completedOrders,
        activeReservations,
        occupiedTables: tables.filter((t) => t.status === 'occupied').length,
        dailyVolume,
        popularDishes,
      },
    });
  });

  // -------------------------------------------------------------
  // Vite Integration (Dev vs Prod)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ember & Spice server active at http://localhost:${PORT}`);
  });
}

startServer();
