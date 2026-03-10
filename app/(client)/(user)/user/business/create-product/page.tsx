'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserData } from '@/contexts/UserDataContext';
import {
  createProductAdmin,
  fileToDataUrl,
  getAllCategories,
  getBrands,
  validateProductPayload,
} from '@/data/client';
import type { IBrand, ICategory, IProduct } from '@/mock-data';
import { ImagePlus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: IProduct['status'];
  variant: IProduct['variant'] | '';
  isFeatured: boolean;
  categoryId: string;
  brandId: string;
  imageDataUrl: string;
  imageFileName: string;
};

const initialForm: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  discount: 0,
  stock: 0,
  status: 'NEW',
  variant: '',
  isFeatured: false,
  categoryId: '',
  brandId: '',
  imageDataUrl: '',
  imageFileName: '',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function BusinessCreateProductPage() {
  const { authUser, isLoading } = useUserData();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const canCreate = authUser?.isBusiness === true || authUser?.businessStatus === 'active';

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([getAllCategories(), getBrands()]);
        setCategories(categoryRes?.data || []);
        setBrands(brandRes?.data || []);
      } catch (error) {
        console.error('Failed to load categories/brands', error);
      }
    };
    if (canCreate) loadOptions();
  }, [canCreate]);

  const finalPrice = useMemo(() => {
    const discount = Math.min(Math.max(form.discount || 0, 0), 100);
    return form.price > 0 ? form.price * (1 - discount / 100) : 0;
  }, [form.discount, form.price]);

  const handleImagePick = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({
        ...prev,
        imageDataUrl: dataUrl,
        imageFileName: file.name,
      }));
    } catch (error) {
      console.error('Failed to read image file', error);
      toast.error('Failed to load image');
    }
  };

  const submit = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      status: form.status,
      variant: form.variant || undefined,
      isFeatured: form.isFeatured,
      categoryId: form.categoryId || undefined,
      brandId: form.brandId || undefined,
      imageDataUrl: form.imageDataUrl || undefined,
    };

    const errors = validateProductPayload(payload);
    setLocalErrors(errors);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    setSubmitting(true);
    try {
      await createProductAdmin(payload);
      toast.success('Product created successfully');
      setForm(initialForm);
      setLocalErrors([]);
    } catch (error) {
      console.error('Failed to create product', error);
      toast.error(
        error instanceof Error ? error.message.split('\n')[0] : 'Failed to create product',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-shop_dark_green" />
      </div>
    );
  }

  if (!canCreate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Only users with an active business account can create products.
          </p>
          <Badge variant="secondary">Current status: {authUser?.businessStatus || 'none'}</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl lg:max-w-full space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Create New Product
            </h1>
            <p className="text-white/90 mt-1">
              Publish products quickly with business-level controls.
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">Business Account</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Example: iPhone 16 Pro"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe key features and value..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount}
                  onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status || 'NEW'}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, status: value as IProduct['status'] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">NEW</SelectItem>
                    <SelectItem value="HOT">HOT</SelectItem>
                    <SelectItem value="SALE">SALE</SelectItem>
                    <SelectItem value="FEATURED">FEATURED</SelectItem>
                    <SelectItem value="PREORDER">PREORDER</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">OUT OF STOCK</SelectItem>
                    <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.categoryId || '__none__'}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, categoryId: value === '__none__' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={form.brandId || '__none__'}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, brandId: value === '__none__' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImagePick(e.target.files?.[0])}
                />
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ImagePlus className="w-5 h-5" />
                  <span>Click to upload image (max 5MB)</span>
                </div>
                {form.imageFileName ? (
                  <p className="mt-2 text-xs text-emerald-700">{form.imageFileName}</p>
                ) : null}
              </label>
            </div>

            {localErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {localErrors.map((error) => (
                  <p key={error}>• {error}</p>
                ))}
              </div>
            )}

            <Button onClick={submit} disabled={submitting} className="w-full">
              {submitting ? 'Creating Product...' : 'Create Product'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-gray-50 p-3">
              {form.imageDataUrl ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={form.imageDataUrl}
                    alt={form.name || 'Preview'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg border border-dashed flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <h3 className="font-semibold mt-3">{form.name || 'Product name'}</h3>
              <p className="text-xs text-gray-500">{form.slug || 'product-slug'}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">${finalPrice.toLocaleString()}</span>
                {form.discount > 0 && <Badge variant="secondary">-{form.discount}%</Badge>}
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Tips:</p>
              <p>• Use clear image with ratio 1:1 or 4:3.</p>
              <p>• Keep slug lowercase for SEO.</p>
              <p>• Price must be greater than 0.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
