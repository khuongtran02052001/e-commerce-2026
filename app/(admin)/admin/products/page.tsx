import AdminProducts from '@/components/admin/AdminProducts';
import { isUserAdmin } from '@/lib/adminUtils';
import { ADMIN_CATEGORIES_QUERYResult } from '@/sanity.types';
// import { getAdminCategories } from '@/sanity/queries';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AdminProductsPage = async () => {
  // Check authentication and admin access
  // const { userId } = await auth();

  // if (!userId) {
  //   redirect('/sign-in');
  // }

  // Get current user details to check admin status
  // const clerk = await clerkClient();
  // const currentUser = await clerk.users.getUser(userId);
  // const userEmail = currentUser.primaryEmailAddress?.emailAddress;

  // Check if current user is admin
  // if (!userEmail || !isUserAdmin(userEmail)) {
  //   redirect('/');
  // }

  // Fetch categories server-side using the query function
  // const categories = await getAdminCategories();

  return <AdminProducts initialCategories={initialCategories} />;
};

export default AdminProductsPage;
export const initialCategories: ADMIN_CATEGORIES_QUERYResult = [
  {
    _id: 'cat_1',
    title: 'Áo thun',
    slug: { _type: 'slug', current: 'ao-thun' },
    description: 'Áo thun cotton, nhiều màu sắc',
    featured: true,
  },
  {
    _id: 'cat_2',
    title: 'Giày thể thao',
    slug: { _type: 'slug', current: 'giay-the-thao' },
    description: 'Giày chạy bộ & sneakers',
    featured: false,
  },
  {
    _id: 'cat_3',
    title: 'Phụ kiện',
    slug: { _type: 'slug', current: 'phu-kien' },
    description: 'Túi, mũ, dây nịch và phụ kiện khác',
    featured: null,
  },
];
