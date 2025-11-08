export interface IProductImageMock {
  id: string;
  url: string;
  alt?: string;
}

export interface IRatingDistributionMock {
  fiveStars?: number;
  fourStars?: number;
  threeStars?: number;
  twoStars?: number;
  oneStar?: number;
}

export interface IProductMock {
  id: string;
  name: string;
  slug: string;
  images?: IProductImageMock[];
  description?: string;
  price: number;
  discount?: number; 
  categories?: string[]; 
  stock?: number;
  brand?: string; 
  status?: "new" | "hot" | "sale";
  variant?: "gadget" | "appliances" | "refrigerators" | "others";
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: IRatingDistributionMock;
}


export interface ICategoryMock {
  id: string;
  title: string;
  slug: string;
  description?: string;
  range?: number;
  featured?: boolean;
  imageUrl?: string;
}

export interface IBrandMock {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}


export interface IBlogCategoryMock {
  id: string;
  name: string;
  slug: string;
}

export interface IAuthorMock {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface IBlogMock {
  id: string;
  title: string;
  slug: string;
  author: IAuthorMock;
  mainImageUrl?: string;
  categories?: IBlogCategoryMock[];
  publishedAt: string; 
  isLatest?: boolean;
  body: string; 
}


export const mockCategories: ICategoryMock[] = [
  {
    id: "cat-001",
    title: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones with cutting-edge features.",
    range: 200,
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    id: "cat-002",
    title: "Laptops",
    slug: "laptops",
    description: "High-performance laptops for work and play.",
    range: 500,
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    id: "cat-003",
    title: "Home Appliances",
    slug: "home-appliances",
    description: "Reliable home appliances for modern living.",
    range: 100,
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-27e9b6b1a2b4",
  },
  {
    id: "cat-004",
    title: "Gaming Accessories",
    slug: "gaming-accessories",
    description: "Gear up your setup with the latest gaming accessories.",
    range: 50,
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1593642532400-2682810df593",
  },
  {
    id: "cat-005",
    title: "Refrigerators",
    slug: "refrigerators",
    description: "Energy-efficient refrigerators to keep food fresh longer.",
    range: 300,
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1598300051341-cb342dc8bd7c",
  },
];


export const mockAuthors: IAuthorMock[] = [
  {
    id: "author-001",
    name: "Alice Nguyen",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Tech writer and gadget enthusiast with a passion for clean design.",
  },
  {
    id: "author-002",
    name: "Minh Tran",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Frontend developer who loves exploring emerging web technologies.",
  },
];

export const mockBlogCategories: IBlogCategoryMock[] = [
  { id: "bcat-001", name: "Tech News", slug: "tech-news" },
  { id: "bcat-002", name: "Tutorials", slug: "tutorials" },
  { id: "bcat-003", name: "Product Reviews", slug: "product-reviews" },
];

export const mockBlogs: IBlogMock[] = [
  {
    id: "blog-001",
    title: "Top 5 Smartphones to Watch in 2025",
    slug: "top-5-smartphones-2025",
    author: mockAuthors[0],
    mainImageUrl:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35d6",
    categories: [mockBlogCategories[0], mockBlogCategories[2]],
    publishedAt: "2025-11-01T10:00:00Z",
    isLatest: true,
    body: `
      <p>2025 is shaping up to be a breakthrough year for mobile technology. 
      With foldable displays becoming mainstream and AI-driven processors, 
      here are the top 5 smartphones you should keep an eye on...</p>
    `,
  },
  {
    id: "blog-002",
    title: "How to Optimize Your React App for Performance",
    slug: "optimize-react-app-performance",
    author: mockAuthors[1],
    mainImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    categories: [mockBlogCategories[1]],
    publishedAt: "2025-10-20T14:30:00Z",
    isLatest: false,
    body: `
      <p>React is fast—but your app might not be. In this article, 
      we'll go over techniques like memoization, lazy loading, 
      and code splitting to make your React app lightning quick.</p>
    `,
  },
  {
    id: "blog-003",
    title: "The Future of Smart Home Appliances",
    slug: "future-of-smart-home-appliances",
    author: mockAuthors[0],
    mainImageUrl:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17",
    categories: [mockBlogCategories[0]],
    publishedAt: "2025-09-15T09:00:00Z",
    isLatest: false,
    body: `
      <p>From refrigerators that track expiration dates to washing machines 
      that schedule their own maintenance, the future of smart homes is closer 
      than you think.</p>
    `,
  },
];

export const mockBrands: IBrandMock[] = [
  {
    id: "brand-001",
    title: "Apple",
    slug: "apple",
    description:
      "Apple designs innovative hardware, software, and services — known for the iPhone, iPad, and Mac.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: "brand-002",
    title: "Samsung",
    slug: "samsung",
    description:
      "Samsung is a global leader in technology, opening new possibilities for people everywhere.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    id: "brand-003",
    title: "Sony",
    slug: "sony",
    description:
      "Sony creates products for entertainment, gaming, and professional technologies with premium design.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_logo.svg",
  },
  {
    id: "brand-004",
    title: "LG",
    slug: "lg",
    description:
      "LG Electronics delivers home appliances and mobile devices that make life good.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/LG_logo_%282015%29.svg",
  },
  {
    id: "brand-005",
    title: "Xiaomi",
    slug: "xiaomi",
    description:
      "Xiaomi focuses on smart hardware connected by an IoT platform with smartphones at its core.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
  },
];

export const mockProducts: IProductMock[] = [
  {
    id: "prod-001",
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    images: [
      { id: "img-001", url: "https://images.unsplash.com/photo-1512499617640-c2f999098e95", alt: "iPhone 16 Pro Front" },
      { id: "img-002", url: "https://images.unsplash.com/photo-1606813902779-0c1b3f6b3e5b", alt: "iPhone 16 Pro Side" },
    ],
    description: "Apple's latest iPhone 16 Pro with A18 Bionic chip and advanced AI camera system.",
    price: 1299,
    discount: 5,
    categories: ["smartphones"],
    stock: 45,
    brand: "apple",
    status: "hot",
    variant: "gadget",
    isFeatured: true,
    averageRating: 4.8,
    totalReviews: 312,
    ratingDistribution: {
      fiveStars: 260,
      fourStars: 40,
      threeStars: 10,
      twoStars: 2,
      oneStar: 0,
    },
  },
  {
    id: "prod-002",
    name: "Samsung Galaxy Z Fold 7",
    slug: "samsung-galaxy-z-fold-7",
    images: [
      { id: "img-003", url: "https://images.unsplash.com/photo-1580910051071-b8c67e34c282", alt: "Samsung Galaxy Z Fold 7" },
    ],
    description: "Next-gen foldable smartphone with 7.6-inch AMOLED display and improved durability.",
    price: 1899,
    discount: 10,
    categories: ["smartphones"],
    stock: 30,
    brand: "samsung",
    status: "new",
    variant: "gadget",
    isFeatured: true,
    averageRating: 4.6,
    totalReviews: 214,
    ratingDistribution: {
      fiveStars: 150,
      fourStars: 50,
      threeStars: 10,
      twoStars: 3,
      oneStar: 1,
    },
  },
  {
    id: "prod-003",
    name: "Sony WH-1000XM6 Headphones",
    slug: "sony-wh-1000xm6",
    images: [
      { id: "img-004", url: "https://images.unsplash.com/photo-1585386959984-a41552231693", alt: "Sony WH-1000XM6" },
    ],
    description: "Noise-cancelling wireless headphones with 40 hours of playback and immersive sound.",
    price: 499,
    discount: 15,
    categories: ["gaming-accessories"],
    stock: 80,
    brand: "sony",
    status: "sale",
    variant: "others",
    isFeatured: false,
    averageRating: 4.9,
    totalReviews: 580,
    ratingDistribution: {
      fiveStars: 500,
      fourStars: 60,
      threeStars: 15,
      twoStars: 3,
      oneStar: 2,
    },
  },
  {
    id: "prod-004",
    name: "LG InstaView Refrigerator",
    slug: "lg-instaview-refrigerator",
    images: [
      { id: "img-005", url: "https://images.unsplash.com/photo-1616627988597-2563c1cc7466", alt: "LG Refrigerator" },
    ],
    description: "Energy-efficient refrigerator with smart glass panel and Wi-Fi connectivity.",
    price: 2199,
    discount: 8,
    categories: ["refrigerators", "home-appliances"],
    stock: 20,
    brand: "lg",
    status: "hot",
    variant: "refrigerators",
    isFeatured: true,
    averageRating: 4.7,
    totalReviews: 123,
    ratingDistribution: {
      fiveStars: 90,
      fourStars: 25,
      threeStars: 6,
      twoStars: 1,
      oneStar: 1,
    },
  },
  {
    id: "prod-005",
    name: "Xiaomi Air Purifier 6 Pro",
    slug: "xiaomi-air-purifier-6-pro",
    images: [
      { id: "img-006", url: "https://images.unsplash.com/photo-1606811843854-6d38e1b21f8c", alt: "Xiaomi Air Purifier" },
    ],
    description: "High-performance air purifier with smart home integration and quiet operation.",
    price: 399,
    discount: 12,
    categories: ["home-appliances"],
    stock: 50,
    brand: "xiaomi",
    status: "new",
    variant: "appliances",
    isFeatured: false,
    averageRating: 4.5,
    totalReviews: 76,
    ratingDistribution: {
      fiveStars: 55,
      fourStars: 15,
      threeStars: 4,
      twoStars: 1,
      oneStar: 1,
    },
  },
];
