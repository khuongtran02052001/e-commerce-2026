import { fetchServiceJson } from '@/lib/restClient';
import type { IProduct } from '@/mock-data';

export interface ProductMutationPayload {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stock?: number;
  status?: string;
  variant?: string;
  isFeatured?: boolean;
  categoryId?: string;
  brandId?: string;
  imageUrl?: string;
  imageDataUrl?: string;
}

const PRODUCT_STATUS_VALUES = new Set([
  'NEW',
  'HOT',
  'SALE',
  'FEATURED',
  'PREORDER',
  'OUT_OF_STOCK',
  'DISCONTINUED',
]);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateProductPayload = (payload: ProductMutationPayload) => {
  const errors: string[] = [];

  if (!payload.name?.trim()) {
    errors.push('Name is required');
  } else if (payload.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  } else if (payload.name.trim().length > 160) {
    errors.push('Name must be at most 160 characters');
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!Number.isFinite(payload.discount ?? 0) || (payload.discount ?? 0) < 0) {
    errors.push('Discount must be 0 or higher');
  } else if ((payload.discount ?? 0) > 100) {
    errors.push('Discount cannot exceed 100%');
  }

  if (!Number.isFinite(payload.stock ?? 0) || (payload.stock ?? 0) < 0) {
    errors.push('Stock cannot be negative');
  }

  if (payload.status && !PRODUCT_STATUS_VALUES.has(payload.status)) {
    errors.push('Invalid status value');
  }

  if (payload.categoryId && !UUID_REGEX.test(payload.categoryId)) {
    errors.push('Category ID is invalid');
  }

  if (payload.brandId && !UUID_REGEX.test(payload.brandId)) {
    errors.push('Brand ID is invalid');
  }

  return errors;
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toApiPayload = (payload: ProductMutationPayload) => {
  const body: Record<string, unknown> = {
    name: payload.name,
    description: payload.description || '',
    price: Number(payload.price) || 0,
    discount: Number(payload.discount) || 0,
    stock: Number(payload.stock) || 0,
    status: payload.status || 'NEW',
    variant: payload.variant || undefined,
    isFeatured: Boolean(payload.isFeatured),
  };

  if (payload.categoryId) body.categoryId = payload.categoryId;
  if (payload.brandId) body.brandId = payload.brandId;
  const imageSource = payload.imageDataUrl || payload.imageUrl;
  if (imageSource) {
    body.images = [{ url: imageSource, alt: payload.name }];
  }

  return body;
};

export const createProductAdmin = (payload: ProductMutationPayload) => {
  const errors = validateProductPayload(payload);
  if (errors.length) {
    throw new Error(errors.join('\n'));
  }
  return fetchServiceJson<IProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(toApiPayload(payload)),
  });
};

export const updateProductAdmin = (productId: string, payload: ProductMutationPayload) => {
  const errors = validateProductPayload(payload);
  if (errors.length) {
    throw new Error(errors.join('\n'));
  }
  return fetchServiceJson<IProduct>(`/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiPayload(payload)),
  });
};

export const deleteProductAdmin = (productId: string) =>
  fetchServiceJson<{ success: boolean }>(`/products/${productId}`, {
    method: 'DELETE',
  });
