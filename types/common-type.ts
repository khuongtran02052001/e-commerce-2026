/* =========================================================
   ENUMS
========================================================= */

export enum NotificationType {
  promo = 'promo',
  order = 'order',
  system = 'system',
  marketing = 'marketing',
  general = 'general',
}

export enum NotificationPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent',
}

export enum EmployeeRole {
  CALL_CENTER = 'CALL_CENTER',
  PACKER = 'PACKER',
  WARE_HOUSE = 'WARE_HOUSE',
  DELIVERY_MAN = 'DELIVERY_MAN',
  INCHARGE = 'INCHARGE',
  ACCOUNTS = 'ACCOUNTS',
}

export enum ProductStatus {
  NEW = 'NEW',
  HOT = 'HOT',
  SALE = 'SALE',
}

/* =========================================================
   BASE
========================================================= */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/* =========================================================
   USER
========================================================= */

export interface User extends BaseEntity {
  email: string;
  password?: string | null;

  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  profileImage?: string | null;

  walletBalance?: number | null;
  isAdmin?: boolean | null;
  isEmployee?: boolean | null;
  employeeRole?: EmployeeRole | null;

  addresses: Address[];
  orders: Order[];
  notifications: Notification[];
}

/* =========================================================
   ORDER
========================================================= */

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;

  customerName: string;
  email: string;
  phone: string;

  status: string;
  paymentMethod: string;
  paymentStatus: string;

  totalPrice: number;
  subtotal?: number | null;
  shipping?: number | null;
  tax?: number | null;

  addressName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  products?: OrderProduct[];
}

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
}

/* =========================================================
   NOTIFICATION
========================================================= */

export interface Notification extends BaseEntity {
  title?: string | null;
  message?: string | null;

  type?: NotificationType | null;
  priority?: NotificationPriority | null;

  read: boolean;
  sentAt?: string | null;
  readAt?: string | null;
  sentBy?: string | null;
  actionUrl?: string | null;

  userId: string;
}

/* =========================================================
   ADDRESS
========================================================= */

export interface Address extends BaseEntity {
  address?: string | null;
  userId?: string | null;
}

/* =========================================================
   CART
========================================================= */

export interface CartItem extends BaseEntity {
  productId?: string | null;
  quantity?: number | null;
  userId?: string | null;
}

/* =========================================================
   CATEGORY
========================================================= */

export interface Category extends BaseEntity {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  range?: number | null;
  featured?: boolean | null;
  imageUrl: string;
}

/* =========================================================
   PRODUCT
========================================================= */

export interface Product extends BaseEntity {
  name?: string | null;
  slug?: string | null;
  description?: string | null;

  price?: number | null;
  discount?: number | null;
  stock?: number | null;

  status?: ProductStatus | null;
  isFeatured?: boolean | null;

  averageRating?: number | null;
  totalReviews?: number | null;

  images?: ProductImage[];
  ratingDistribution?: RatingDistribution[];

  categoryId?: string | null;
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

export interface ProductImage extends BaseEntity {
  url?: string | null;
  alt?: string | null;
  productId: string;
}

/* =========================================================
   RATING DISTRIBUTION
========================================================= */

export interface RatingDistribution extends BaseEntity {
  fiveStars?: number | null;
  fourStars?: number | null;
  threeStars?: number | null;
  twoStars?: number | null;
  oneStar?: number | null;
  productId: string;
}

/* =========================================================
   API RESPONSE (DÙNG RẤT NHIỀU)
========================================================= */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
