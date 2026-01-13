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

export interface IProduct {
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
  status?: 'NEW' | 'HOT' | 'SALE' | 'FEATURED' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'PREORDER';
  variant?: 'gadget' | 'appliances' | 'refrigerators' | 'others';
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: IRatingDistributionMock;
  createdAt: string;
}

export interface ICategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  range?: number;
  featured?: boolean;
  imageUrl?: string;
}

export interface IBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface IBlogCategoryMock {
  id: string;
  title: string;
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

export const mockCategories: ICategory[] = [
  {
    id: 'cat-001',
    title: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest smartphones with cutting-edge features.',
    range: 200,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: 'cat-002',
    title: 'Laptops',
    slug: 'laptops',
    description: 'High-performance laptops for work and play.',
    range: 500,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  },
  {
    id: 'cat-003',
    title: 'Home Appliances',
    slug: 'home-appliances',
    description: 'Reliable home appliances for modern living.',
    range: 100,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-27e9b6b1a2b4',
  },
  {
    id: 'cat-004',
    title: 'Gaming Accessories',
    slug: 'gaming-accessories',
    description: 'Gear up your setup with the latest gaming accessories.',
    range: 50,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593',
  },
  {
    id: 'cat-005',
    title: 'Refrigerators',
    slug: 'refrigerators',
    description: 'Energy-efficient refrigerators to keep food fresh longer.',
    range: 300,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1598300051341-cb342dc8bd7c',
  },
];

export const mockAuthors: IAuthorMock[] = [
  {
    id: 'author-001',
    name: 'Alice Nguyen',
    avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Tech writer and gadget enthusiast with a passion for clean design.',
  },
  {
    id: 'author-002',
    name: 'Minh Tran',
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Frontend developer who loves exploring emerging web technologies.',
  },
];

export const mockBlogCategories: IBlogCategoryMock[] = [
  { id: 'bcat-001', title: 'Tech News', slug: 'tech-news' },
  { id: 'bcat-002', title: 'Tutorials', slug: 'tutorials' },
  { id: 'bcat-003', title: 'Product Reviews', slug: 'product-reviews' },
];

export const mockBlogs: IBlogMock[] = [
  {
    id: 'blog-001',
    title: 'Top 5 Smartphones to Watch in 2025',
    slug: 'top-5-smartphones-2025',
    author: mockAuthors[0],
    mainImageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35d6',
    categories: [mockBlogCategories[0], mockBlogCategories[2]],
    publishedAt: '2025-11-01T10:00:00Z',
    isLatest: true,
    body: `
      <p>2025 is shaping up to be a breakthrough year for mobile technology. 
      With foldable displays becoming mainstream and AI-driven processors, 
      here are the top 5 smartphones you should keep an eye on...</p>
    `,
  },
  {
    id: 'blog-002',
    title: 'How to Optimize Your React App for Performance',
    slug: 'optimize-react-app-performance',
    author: mockAuthors[1],
    mainImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    categories: [mockBlogCategories[1]],
    publishedAt: '2025-10-20T14:30:00Z',
    isLatest: false,
    body: `
      <p>React is fast—but your app might not be. In this article, 
      we'll go over techniques like memoization, lazy loading, 
      and code splitting to make your React app lightning quick.</p>
    `,
  },
  {
    id: 'blog-003',
    title: 'The Future of Smart Home Appliances',
    slug: 'future-of-smart-home-appliances',
    author: mockAuthors[0],
    mainImageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17',
    categories: [mockBlogCategories[0]],
    publishedAt: '2025-09-15T09:00:00Z',
    isLatest: false,
    body: `
      <p>From refrigerators that track expiration dates to washing machines 
      that schedule their own maintenance, the future of smart homes is closer 
      than you think.</p>
    `,
  },
];

export const mockBrands: IBrand[] = [
  {
    id: 'brand-001',
    name: 'Apple',
    slug: 'apple',
    description:
      'Apple designs innovative hardware, software, and services — known for the iPhone, iPad, and Mac.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
  {
    id: 'brand-002',
    name: 'Samsung',
    slug: 'samsung',
    description:
      'Samsung is a global leader in technology, opening new possibilities for people everywhere.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  },
  {
    id: 'brand-003',
    name: 'Sony',
    slug: 'sony',
    description:
      'Sony creates products for entertainment, gaming, and professional technologies with premium design.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_logo.svg',
  },
  {
    id: 'brand-004',
    name: 'LG',
    slug: 'lg',
    description: 'LG Electronics delivers home appliances and mobile devices that make life good.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/LG_logo_%282015%29.svg',
  },
  {
    id: 'brand-005',
    name: 'Xiaomi',
    slug: 'xiaomi',
    description:
      'Xiaomi focuses on smart hardware connected by an IoT platform with smartphones at its core.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
  },
];
