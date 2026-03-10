# ShopCartPro - Readme Tutorial

Tài liệu này mô tả cách dùng app, cách chạy project, và flow hoạt động tổng quan hiện tại (đã chuyển sang REST API).

## 1) Tổng quan kiến trúc

- Frontend: Next.js App Router (React 19).
- Auth: NextAuth (Google OAuth) + token từ BE.
- Backend: service-system và service-blog (REST).
- Fetch thống nhất:
  - Client: `fetchService()` trong `lib/restClient.ts` tự gắn `Authorization` từ NextAuth session.
  - Server: `fetchServiceServer()` hoặc `fetchServiceJsonServer()` với `accessToken`.
- Routing:
  - Public pages: `app/(client)` (home, shop, product, blog, cart, checkout).
  - Auth pages: `app/(auth)` (sign-in).
  - User pages: `app/(client)/(user)/user/*`.
  - Admin pages: `app/(client)/(user)/user/admin/*`.
- Middleware: `proxy.ts` bảo vệ route `/user` và `/user/admin` theo NextAuth + `NEXT_PUBLIC_ADMIN_EMAIL`.

## 2) Yêu cầu môi trường

- Node.js 18+
- pnpm (khuyến nghị) hoặc npm/yarn
- Backend chạy sẵn:
  - `NEXT_PUBLIC_API_URL` trỏ tới service-system/blog
  - Ví dụ: `https://identical-carmel-serverless-87721e49.koyeb.app`

## 3) Cấu hình môi trường

Tối thiểu cần:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-backend-domain

NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_ADMIN_EMAIL=["admin@yourdomain.com"]

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Gợi ý:
- `NEXT_PUBLIC_ADMIN_EMAIL` là mảng string, middleware dùng để kiểm tra admin.

## 4) Chạy project

```bash
pnpm install
pnpm dev
```

Build production:

```bash
pnpm build
pnpm start
```

## 5) Flow hoạt động chính

### 5.1 Auth

1. Người dùng mở `/sign-in`.
2. Click "Continue with Google".
3. NextAuth gọi BE: `POST /service-system/v1/api/auth/google-login`.
4. BE trả `accessToken`, được lưu vào NextAuth session.
5. Các request sau dùng `fetchService()` sẽ tự gắn `Authorization: Bearer <token>`.

### 5.2 User dashboard

- `/user/dashboard`
  - `GET /service-system/v1/api/user/status` (trạng thái premium/business).
  - `GET /service-system/v1/api/user/dashboard/stats`.
  - `GET /service-system/v1/api/auth/me` để hiển thị tên/email.

### 5.3 User profile

- `/user/profile`
  - `GET /service-system/v1/api/auth/me` (thông tin user).
  - `PUT /service-system/v1/api/auth/me` (sửa profile).
  - `GET/POST/PUT/DELETE /service-system/v1/api/user/addresses` (địa chỉ).

### 5.4 Notifications

- `/user/notifications`
  - `GET /service-system/v1/api/user/notifications`
  - `PATCH /service-system/v1/api/user/notifications` (mark read)
  - `DELETE /service-system/v1/api/user/notifications?id=...`

### 5.5 Orders

- `/user/orders`
  - `GET /service-system/v1/api/user/orders?page=&limit=`
- `/user/orders/[id]`
  - `GET /service-system/v1/api/orders/{id}`
  - Đối chiếu quyền bằng `userId/customerId/email` từ `/auth/me`.

### 5.6 Checkout & Payments (Stripe)

1. Cart -> tạo order.
2. Thanh toán Stripe.
3. Webhook (`/api/webhook`) gọi BE: `POST /service-system/v1/api/orders/{orderId}/pay-now`.
4. Order cập nhật trạng thái -> hiển thị lại trong `/user/orders`.

### 5.7 Admin

Các page trong `/user/admin/*` gọi REST:

- Premium accounts:
  - `GET /service-system/v1/api/admin/premium-accounts`
  - `POST /service-system/v1/api/admin/premium-accounts/approve`
- Business accounts:
  - `GET /service-system/v1/api/admin/business-accounts`
  - `POST /service-system/v1/api/admin/business-accounts/approve`
- Manage users:
  - `POST /service-system/v1/api/admin/manage-user`

Middleware kiểm tra admin dựa trên `NEXT_PUBLIC_ADMIN_EMAIL`.

## 6) Roles & Quyền

### 6.1 Admin

- Điều kiện: `isAdmin = true` **hoặc** email nằm trong `NEXT_PUBLIC_ADMIN_EMAIL`.
- Quyền:
  - Duyệt premium requests.
  - Duyệt business requests.
  - Quản lý user (set premium/standard).

### 6.2 Premium user

- Điều kiện: `premiumStatus = active` và `isActive = true`.
- Quyền:
  - Mở khoá các quyền lợi premium (ưu đãi, hỗ trợ ưu tiên).
  - Có thể apply business.

### 6.3 Business user

- Điều kiện: `isBusiness = true` và `businessStatus = active`.
- Quyền:
  - Ưu đãi business (giảm giá thêm, ưu tiên hỗ trợ).
  - **Không** có quyền duyệt (chỉ admin mới duyệt).

### 6.4 Regular user

- Điều kiện: không premium, không business.
- Quyền: dùng tính năng cơ bản (mua hàng, order, wishlist, review).

### 6.5 Flow duyệt

- User nhấn “Apply Premium” → `premiumStatus = pending`.
- Admin vào `/user/admin/premium-accounts` để approve/reject.
- Premium active có thể apply business → `businessStatus = pending`.
- Admin vào `/user/admin/business-accounts` để approve/reject.

## 6) Quy ước fetch API

### Client side

```ts
import { fetchServiceJson } from '@/lib/restClient';
const data = await fetchServiceJson('/auth/me');
```

### Server side

```ts
import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';

const session = await auth();
const profile = await fetchServiceJsonServer('/auth/me', {
  accessToken: session?.accessToken,
});
```

### Service khác

```ts
fetchServiceJson('/blogs', { service: 'blog' });
```

## 7) Cấu trúc thư mục quan trọng

- `app/(client)`: UI public
- `app/(auth)`: auth pages
- `app/(client)/(user)/user`: user pages
- `components/`: UI components
- `lib/restClient.ts`: fetch thống nhất + token
- `data/server/_fetch.ts`: fetch cho server với cache
- `types/order.ts`: type REST cho orders

## 8) Lưu ý chuyển đổi từ Sanity/Clerk

- Các page user/admin đã chuyển qua REST.

## 9) Troubleshooting nhanh

- 401/403: kiểm tra `NEXTAUTH_SECRET`, Google OAuth và token BE.
- API trả lỗi: kiểm tra `NEXT_PUBLIC_API_URL`.
- Admin không vào được: kiểm tra `NEXT_PUBLIC_ADMIN_EMAIL`.

---

## ✨ Features

### 🎯 Core Features (Free)

- 🛍️ **Product Management** - Complete product catalog with categories, brands, and search
- 🛒 **Shopping Cart** - Persistent cart with real-time updates
- 💝 **Wishlist** - Save favorite products for later
- 📦 **Order Management** - Track orders and order history
- 📱 **Responsive Design** - Mobile-first responsive UI
- 🎨 **Modern UI/UX** - Built with Tailwind CSS and Framer Motion
- 🔍 **Advanced Search & Filters** - Filter by category, brand, price, and more
- ⭐ **Product Reviews** - Customer reviews and ratings
- 📧 **Email Notifications** - Order confirmations and updates via Nodemailer

### 👑 Premium Features (Paid Version)

- 📊 **Advanced Analytics Dashboard** - Comprehensive business insights
- 👥 **Employee Management System** - Multi-role employee portal
- 📝 **Review Management Tools** - Moderate and manage customer reviews
- 📬 **Subscription Management** - Newsletter and email campaigns
- 📈 **Customer Insights & Reports** - Detailed customer analytics
- 📥 **Export Data to Excel/CSV** - Export all data for analysis
- 🎨 **Custom Admin Branding** - Customize admin panel
- 🚀 **Priority Support & Updates** - Fast support and early access to features


```
shopcartpro/
├── app/                           # Next.js 16 App Router
│   ├── (admin)/                  # Admin Panel Routes
│   │   └── admin/
│   │       ├── page.tsx          # Admin Dashboard (Premium) ⭐
│   │       ├── layout.tsx        # Admin layout with navigation
│   │       ├── analytics/        # Analytics Dashboard (Premium) ⭐
│   │       ├── reviews/          # Review Management (Premium) ⭐
│   │       ├── subscriptions/    # Subscription Management (Premium) ⭐
│   │       ├── employees/        # Employee Management
│   │       ├── products/         # Product Management
│   │       ├── orders/           # Order Management
│   │       ├── users/            # User Management
│   │       ├── account-requests/ # Account Requests
│   │       ├── notifications/    # Notification Center
│   │       └── access-denied/    # Access Denied Page
│   │
│   ├── (auth)/                   # Authentication Routes
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/ 
│   │   └── sign-up/
│   │       └── [[...sign-up]]/ 
│   │
│   ├── (client)/                 # Client-Facing Routes
│   │   ├── page.tsx             # Home Page
│   │   ├── layout.tsx           # Client layout with header/footer
│   │   ├── shop/                # Shop All Products
│   │   ├── category/
│   │   │   ├── page.tsx         # All Categories
│   │   │   └── [slug]/          # Category Detail Page
│   │   ├── product/
│   │   │   ├── page.tsx         # All Products
│   │   │   └── [slug]/          # Product Detail Page
│   │   ├── brands/
│   │   │   ├── page.tsx         # All Brands
│   │   │   └── [slug]/          # Brand Detail Page
│   │   ├── blog/
│   │   │   ├── page.tsx         # All Blog Posts
│   │   │   └── [slug]/          # Blog Post Detail
│   │   ├── deal/                # Special Deals
│   │   ├── orders/              # Order Tracking
│   │   ├── dashboard/           # User Dashboard
│   │   │
│   │   ├── (public)/            # Public Pages
│   │   │   ├── about/           # About Us
│   │   │   ├── contact/         # Contact Us
│   │   │   ├── privacy/         # Privacy Policy
│   │   │   ├── terms/           # Terms & Conditions
│   │   │   ├── faq/             # FAQ Page
│   │   │   ├── faqs/            # FAQs Alternative
│   │   │   └── help/            # Help Center
│   │   │
│   │   └── (user)/              # Protected User Routes
│   │       ├── cart/            # Shopping Cart
│   │       ├── checkout/        # Checkout Process
│   │       ├── wishlist/        # Wishlist
│   │       ├── success/         # Payment Success
│   │       └── user/
│   │           ├── page.tsx                    # User Profile
│   │           ├── dashboard/                  # User Dashboard
│   │           ├── profile/                    # Edit Profile
│   │           ├── orders/                     # Order History
│   │           │   └── [id]/                   # Order Details
│   │           ├── notifications/              # User Notifications
│   │           ├── settings/                   # Account Settings
│   │           └── admin/                      # User Admin Tools
│   │               ├── manage-users/           # Manage Users
│   │               ├── business-accounts/      # Business Accounts
│   │               └── premium-accounts/       # Premium Accounts
│   │
│   ├── (employee)/               # Employee Portal (Premium) ⭐
│   │   └── employee/
│   │       ├── page.tsx         # Shows Premium Upgrade Message
│   │       └── layout.tsx       # Employee layout (gated)
│   │
│   ├── api/                      # API Routes
│   │   ├── checkout/
│   │   │   ├── stripe/          
│   │   │   │   └── complete/    
│   │   ├── webhooks/
│   │   │   └── stripe/          
│   │   ├── orders/              # Order Management APIs
│   │   ├── products/            # Product APIs
│   │   ├── user/                # User APIs
│   │   ├── cart/                # Cart APIs
│   │   ├── wishlist/            # Wishlist APIs
│   │   ├── reviews/             # Review APIs
│   │   ├── email/               # Email Service APIs
│   │   └── notifications/       # Notification APIs
│   │
│   │
│   ├── layout.tsx               # Root Layout
│   ├── globals.css              # Global Styles
│   ├── not-found.tsx            # 404 Page
│   ├── robots.ts                # Robots.txt Generator
│   └── sitemap.ts               # Sitemap Generator
│
├── components/                   # React Components
│   ├── admin/                   # Admin Components
│   │   ├── AdminDashboardOverview.tsx
│   │   ├── AdminPremiumFeature.tsx    # Premium Message Component
│   │   ├── AdminTopNavigation.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── AdminReviews.tsx
│   │   ├── AdminSubscriptions.tsx
│   │   ├── EmployeeManagement.tsx
│   │   ├── EmployeeOrderManagement.tsx
│   │   └── ...
│   │
│   ├── cart/                    # Cart Components
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── ...
│   │
│   ├── checkout/                # Checkout Components
│   │   ├── CheckoutContent.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── DirectPaymentModal.tsx
│   │   └── ...
│   │
│   ├── employee/                # Employee Components (Premium)
│   │   └── PaidFeatureMessage.tsx   # Premium Upgrade Message
│   │
│   ├── product/                 # Product Components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductReviews.tsx
│   │   └── ...
│   │
│   ├── profile/                 # User Profile Components
│   │   ├── ProfileForm.tsx
│   │   ├── OrderHistory.tsx
│   │   └── ...
│   │
│   ├── ui/                      # UI Components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── PremiumFloatingButton.tsx    # Premium Upgrade Button
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Container.tsx
│   └── ...
│
├── actions/                     # Server Actions
│   ├── userActions.ts          # User-related actions
│   ├── orderActions.ts         # Order-related actions
│   ├── employeeActions.ts      # Employee actions (for admin)
│   ├── orderEmployeeActions.ts # Order employee actions
│   ├── reviewActions.ts        # Review actions
│   ├── wishlistActions.ts      # Wishlist actions
│   ├── walletActions.ts        # Wallet actions
│   ├── emailUserActions.ts     # Email actions
│   └── ...
│
├── lib/                         # Utility Functions
│   ├── adminUtils.ts           # Admin utility functions
│   ├── orderStatus.ts          # Order status management
│   ├── emailImageUtils.ts      # Email utilities
│   ├── notificationService.ts  # Notification service
│   └── ...
│
│
├── types/                       # TypeScript Definitions
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   ├── employee.ts
│   └── ...
│
├── hooks/                       # Custom React Hooks
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useOrderPlacement.ts
│   └── ...
│
├── config/                      # Configuration Files
│   └── contact.ts              # Contact information config
│
├── constants/                   # Constants
│   └── index.ts
│
├── public/                      # Static Assets
│   ├── preview.png             # App preview image
│   └── ...
│
├── .env                         # Environment Variables (git-ignored)
├── next.config.ts              # Next.js Configuration
├── tailwind.config.ts          # Tailwind CSS Configuration
├── tsconfig.json               # TypeScript Configuration
└── package.json                # Dependencies & Scripts
```
