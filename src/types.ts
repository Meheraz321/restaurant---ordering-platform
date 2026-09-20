export type Role = 'customer' | 'admin' | 'kitchen';

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'served'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'card' | 'stripe' | 'bkash' | 'nagad';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type TableType = 'indoor' | 'outdoor' | 'couple' | 'family' | 'vip';

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'cleaning' | 'unavailable';

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'seated' | 'completed' | 'cancelled';

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface FoodVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isSpicy?: boolean;
  spiceLevel?: number; // 0 to 3
  isVeg?: boolean;
  isVegan?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isChefSpecial?: boolean;
  calories: number;
  prepTime: string;
  allergens: string[];
  ingredients: string[];
  variants?: FoodVariant[];
  addons?: FoodAddon[];
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count?: number;
}

export interface CartItem {
  id: string;
  foodId: string;
  food: FoodItem;
  quantity: number;
  selectedVariant?: FoodVariant;
  selectedAddons: FoodAddon[];
  itemPrice: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: {
    address: string;
    area: string;
    district: string;
    instructions?: string;
  };
  items: {
    foodId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    addons?: string[];
    variant?: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  specialInstructions?: string;
  estimatedTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableType: TableType;
  tableNumber?: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface RestaurantTable {
  id: string;
  number: string;
  name: string;
  type: TableType;
  capacity: number;
  location: string;
  status: TableStatus;
  posX: number;
  posY: number;
}

export interface Review {
  id: string;
  foodId?: string;
  foodName?: string;
  customerName: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  photoUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  description: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'reservation' | 'promo' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface RestaurantSettings {
  brandName: string;
  tagline: string;
  logoText: string;
  phone: string;
  email: string;
  address: string;
  openingHours: {
    weekdays: string;
    weekends: string;
    sunday: string;
  };
  deliveryFee: number;
  taxRatePercent: number;
  currency: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  heroBanner: {
    headline: string;
    subtitle: string;
    storyHeadline: string;
    storyParagraph1: string;
    storyParagraph2: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  savedAddresses?: string[];
}
