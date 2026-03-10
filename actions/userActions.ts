'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { revalidatePath } from 'next/cache';

interface AddToCartData {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface UpdateCartItemData {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CreateAddressData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

type ApiUser = { id?: string };

async function getSessionOrUnauthorized() {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('User not authenticated');
  }
  return session;
}

async function getAuthedUserId(accessToken: string) {
  const user = await fetchServiceJsonServer<ApiUser>('/auth/me', {
    accessToken,
    cache: 'no-store',
  });
  const userId = user?.id;
  if (!userId) {
    throw new Error('User not found');
  }
  return userId;
}

export async function updateCartItem(data: UpdateCartItemData) {
  try {
    const session = await getSessionOrUnauthorized();
    const userId = await getAuthedUserId(session.accessToken!);

    await fetchServiceJsonServer(`/users/${userId}/cart/${data.productId}`, {
      method: 'PUT',
      accessToken: session.accessToken,
      body: JSON.stringify({
        quantity: data.quantity,
        size: data.size,
        color: data.color,
      }),
    });

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Failed to update cart item');
  }
}

export async function removeFromCart(productId: string, size?: string, color?: string) {
  try {
    const session = await getSessionOrUnauthorized();
    const userId = await getAuthedUserId(session.accessToken!);

    await fetchServiceJsonServer(`/users/${userId}/cart/${productId}`, {
      method: 'DELETE',
      accessToken: session.accessToken,
      body: JSON.stringify({
        size,
        color,
      }),
    });

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error('Failed to remove item from cart');
  }
}
