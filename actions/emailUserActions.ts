'use server';

import { auth } from '@/lib/auth'; // NextAuth
import { fetchServiceJsonServer } from '@/lib/restClient';
import { revalidatePath } from 'next/cache';

// =========================
// Types
// =========================
interface CreateAddressData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

// =========================
// Helper: Get logged-in email
// =========================
async function getUserSession() {
  return auth();
}

// =========================
// Create Address
// =========================
export async function createAddressForUser(addressData: CreateAddressData) {
  try {
    const session = await getUserSession();
    const email = session?.user?.email || null;
    if (!email) throw new Error('User not authenticated');

    const res = await fetchServiceJsonServer('/address/create', {
      method: 'POST',
      body: JSON.stringify({ email, ...addressData }),
      accessToken: session?.accessToken,
    });

    revalidatePath('/cart');
    return res;
  } catch (err) {
    console.error('Error creating address:', err);
    throw new Error('Failed to create address');
  }
}

// =========================
// Update Address
// =========================
export async function updateAddressForUser(addressId: string, data: CreateAddressData) {
  try {
    const session = await getUserSession();
    const email = session?.user?.email || null;
    if (!email) throw new Error('User not authenticated');

    const res = await fetchServiceJsonServer(`/address/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify({ email, ...data }),
      accessToken: session?.accessToken,
    });

    revalidatePath('/cart');
    return res;
  } catch (err) {
    console.error('Error updating address:', err);
    throw new Error('Failed to update address');
  }
}

// =========================
// Delete Address
// =========================
export async function deleteAddressForUser(addressId: string) {
  try {
    const session = await getUserSession();
    const email = session?.user?.email || null;
    if (!email) throw new Error('User not authenticated');

    const res = await fetchServiceJsonServer(`/address/${addressId}`, {
      method: 'DELETE',
      body: JSON.stringify({ email }),
      accessToken: session?.accessToken,
    });

    revalidatePath('/cart');
    return res;
  } catch (err) {
    console.error('Error deleting address:', err);
    throw new Error('Failed to delete address');
  }
}

// =========================
// Placeholder — Since cart is Zustand
// =========================
export async function simulateAddToCart(item: CartItem) {
  return { success: true };
}

export async function getUserEmailFromAuth() {
  try {
    const session = await getUserSession();
    return session?.user?.email || null;
  } catch {
    return null;
  }
}
