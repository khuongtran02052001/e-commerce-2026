'use server';

import { auth } from '@/lib/auth'; // NextAuth
import axiosClient from '@/lib/axiosClient';
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
async function getUserEmail() {
  const session = await auth();
  return session?.user?.email || null;
}

// =========================
// Create Address
// =========================
export async function createAddressForUser(addressData: CreateAddressData) {
  try {
    const email = await getUserEmail();
    if (!email) throw new Error('User not authenticated');

    const res = await axiosClient.post('/address/create', {
      email,
      ...addressData,
    });

    revalidatePath('/cart');
    return res.data;
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
    const email = await getUserEmail();
    if (!email) throw new Error('User not authenticated');

    const res = await axiosClient.put(`/address/${addressId}`, {
      email,
      ...data,
    });

    revalidatePath('/cart');
    return res.data;
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
    const email = await getUserEmail();
    if (!email) throw new Error('User not authenticated');

    const res = await axiosClient.delete(`/address/${addressId}`, {
      data: { email },
    });

    revalidatePath('/cart');
    return res.data;
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
    return await getUserEmail();
  } catch {
    return null;
  }
}
