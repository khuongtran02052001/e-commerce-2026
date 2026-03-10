import ProfileClient from '@/components/profile/ProfileClient';
import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { redirect } from 'next/navigation';

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  default: boolean;
  type: 'home' | 'office' | 'other';
  createdAt?: string;
  phone?: string;
  subArea?: string;
  countryCode?: string;
  stateCode?: string;
}

interface UserProfile {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: {
    url?: string;
    asset?: {
      url: string;
    };
  };
  addresses?: Address[];
  preferences?: Record<string, unknown>;
  loyaltyPoints?: number;
  rewardPoints?: number;
  totalSpent?: number;
  lastLogin?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default async function ProfilePage() {
  const session = await auth();
  const accessToken = session?.accessToken;
  const sessionUser = session?.user;

  if (!sessionUser) {
    redirect('/sign-in');
  }

  let user: UserProfile | null = null;

  if (accessToken) {
    try {
      const authMe = await fetchServiceJsonServer<{ data?: UserProfile; user?: UserProfile }>(
        '/auth/me',
        { accessToken },
      );
      user = authMe?.data || authMe?.user || null;
    } catch (error) {
      console.error('Error fetching auth user:', error);
    }
  }

  if (!user) {
    user = {
      id: sessionUser.id,
      email: sessionUser.email ?? undefined,
      firstName: sessionUser.name?.split(' ')[0] ?? undefined,
      lastName: sessionUser.name?.split(' ').slice(1).join(' ') || undefined,
      profileImage: sessionUser.image
        ? {
            url: sessionUser.image,
          }
        : undefined,
    };
  }

  const normalizedUser: UserProfile = {
    ...user,
    id: user.id || user.id,
    profileImage:
      user.profileImage ||
      (session?.user?.image
        ? {
            url: session.user.image,
          }
        : undefined),
  };

  return <ProfileClient user={normalizedUser} />;
}
