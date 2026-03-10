'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createProductAdmin,
  deleteProductAdmin,
  getAllCategories,
  getBrands,
  updateProductAdmin,
} from '@/data/client';
import { formatCurrency } from '@/lib/formatCurrency';
import { IBrand, ICategory, IProduct } from '@/mock-data';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Package2,
  Pencil,
  Plus,
  RefreshCw,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { handleApiError, safeApiCall } from './apiHelpers';
import { ProductsSkeleton } from './SkeletonLoaders';

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
  imageUrl: string;
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
  imageUrl: '',
};

const AdminProducts: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [productCategory, setProductCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [productForm, setProductForm] = useState<ProductFormState>(initialForm);

  const limit = 10;
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(0);
    }
  }, [debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([getAllCategories(), getBrands()]);
        setCategories(categoryRes?.data || []);
        setBrands(brandRes?.data || []);
      } catch (error) {
        console.error('Failed to load product options', error);
      }
    };

    loadOptions();
  }, []);

  const mapProductToForm = (product: IProduct): ProductFormState => ({
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    price: Number(product.price || 0),
    discount: Number(product.discount || 0),
    stock: Number(product.stock || 0),
    status: product.status || 'NEW',
    variant: product.variant || '',
    isFeatured: Boolean(product.isFeatured),
    categoryId: product.categories?.[0]?.id || '',
    brandId: product.brand?.id || '',
    imageUrl: product.images?.[0]?.url || '',
  });

  const toMutationPayload = (form: ProductFormState) => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    discount: Number(form.discount),
    stock: Number(form.stock),
    status: form.status || 'NEW',
    variant: form.variant || undefined,
    isFeatured: form.isFeatured,
    categoryId: form.categoryId || undefined,
    brandId: form.brandId || undefined,
    imageUrl: form.imageUrl || undefined,
  });

  // Fetch products
  const fetchProducts = useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        const categoryParam = productCategory === 'all' ? '' : productCategory;
        const { data } = await safeApiCall(
          `/admin/products?limit=${limit}&offset=${
            page * limit
          }&category=${categoryParam}&search=${debouncedSearchTerm}`,
        );
        setProducts(data);
      } catch (error) {
        handleApiError(error, 'Products fetch');
      } finally {
        setLoading(false);
      }
    },
    [productCategory, debouncedSearchTerm, limit],
  );

  // Effects
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [productCategory, debouncedSearchTerm]);

  // Keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isProductDetailsOpen || !selectedProduct?.images || selectedProduct.images.length <= 1) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setIsProductDetailsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isProductDetailsOpen, selectedProduct?.images]);

  // Handle product view
  const handleViewProduct = async (product: IProduct) => {
    try {
      // Reset image index when viewing a new product
      setCurrentImageIndex(0);
      // Fetch complete product details
      const response = await safeApiCall(`/admin/products?id=${product.id}`);
      setSelectedProduct(response.product || product);
      setIsProductDetailsOpen(true);
    } catch (error) {
      handleApiError(error, 'Product details fetch');
      // Fallback to existing product data
      setCurrentImageIndex(0);
      setSelectedProduct(product);
      setIsProductDetailsOpen(true);
    }
  };

  const openCreateProductForm = () => {
    setEditingProductId(null);
    setProductForm(initialForm);
    setIsProductFormOpen(true);
  };

  const openEditProductForm = (product: IProduct) => {
    setEditingProductId(product.id);
    setProductForm(mapProductToForm(product));
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }

    setIsSavingProduct(true);
    try {
      const payload = toMutationPayload(productForm);
      if (editingProductId) {
        await updateProductAdmin(editingProductId, payload);
        toast.success('Product updated successfully');
      } else {
        await createProductAdmin(payload);
        toast.success('Product created successfully');
      }
      setIsProductFormOpen(false);
      await fetchProducts(currentPage);
    } catch (error) {
      console.error('Failed to save product', error);
      toast.error('Failed to save product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: IProduct) => {
    const confirmed = window.confirm(`Delete product "${product.name}"?`);
    if (!confirmed) return;

    try {
      await deleteProductAdmin(product.id);
      toast.success('Product deleted successfully');
      await fetchProducts(currentPage);
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product');
    }
  };

  // Carousel navigation functions
  const goToPrevImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images!.length - 1 : prev - 1));
    }
  };

  const goToNextImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === selectedProduct.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch ((status || '').toUpperCase()) {
      case 'HOT':
        return 'destructive';
      case 'NEW':
      case 'FEATURED':
        return 'default';
      case 'SALE':
        return 'secondary';
      case 'OUT_OF_STOCK':
      case 'DISCONTINUED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatStatusLabel = (status?: string) =>
    (status || 'N/A')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <h3 className="text-lg font-semibold">Products Management</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48"
          />
          <Select value={productCategory} onValueChange={setProductCategory}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.title || ''}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => fetchProducts(currentPage)} size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            <span className="ml-2 sm:hidden">Refresh</span>
          </Button>
          <Button onClick={openCreateProductForm} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <ProductsSkeleton />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {product.images && product.images[0] ? (
                                  <Image
                                    src={product.images[0].url}
                                    alt={product.name || 'Product'}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              {/* Product Info */}
                              <div className="min-w-0">
                                <div className="font-medium truncate">{product.name}</div>
                                {product.isFeatured && (
                                  <Badge variant="secondary" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.categories ? product.categories[0]?.title : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {product.brand?.name || product.brand?.name || 'N/A'}
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant={product.stock! > 0 ? 'default' : 'destructive'}>
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{product.status}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewProduct(product)}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditProductForm(product)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteProduct(product)}
                                title="Delete"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.length === 0 ? (
              <Card>
                <div className="p-8 text-center text-muted-foreground">No products found.</div>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product.id}>
                  <div className="p-4 space-y-4">
                    {/* Product Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name || 'Product'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {product.isFeatured && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProduct(product)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditProductForm(product)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Category</div>
                        <div className="font-medium">{product.categories?.[0].title || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Brand</div>
                        <div className="font-medium">{product.brand?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Price</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Stock</div>
                        <Badge
                          variant={product.stock! > 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {product.stock} units
                        </Badge>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge
                          variant={getStatusColor(product.status!)}
                          className="text-xs capitalize"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-4">
            <Button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              Page {currentPage + 1}
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Product Create/Edit Sheet */}
      <Sheet open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <SheetContent className="w-full sm:w-[520px] overflow-y-auto p-6">
          <SheetHeader className="pb-4">
            <SheetTitle>{editingProductId ? 'Edit Product' : 'Create Product'}</SheetTitle>
            <SheetDescription>
              {editingProductId
                ? 'Update product information and save changes.'
                : 'Create a new product for your catalog.'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Product name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, price: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={productForm.discount}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, discount: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, stock: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={productForm.status || 'NEW'}
                  onValueChange={(value) =>
                    setProductForm((prev) => ({ ...prev, status: value as IProduct['status'] }))
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
                    <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                    <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={productForm.categoryId || '__none__'}
                  onValueChange={(value) =>
                    setProductForm((prev) => ({
                      ...prev,
                      categoryId: value === '__none__' ? '' : value,
                    }))
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
                  value={productForm.brandId || '__none__'}
                  onValueChange={(value) =>
                    setProductForm((prev) => ({
                      ...prev,
                      brandId: value === '__none__' ? '' : value,
                    }))
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
              <Label>Image URL</Label>
              <Input
                value={productForm.imageUrl}
                onChange={(e) => setProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsProductFormOpen(false)}
                disabled={isSavingProduct}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={isSavingProduct}>
                {isSavingProduct
                  ? 'Saving...'
                  : editingProductId
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Details Sidebar */}
      <Sheet open={isProductDetailsOpen} onOpenChange={setIsProductDetailsOpen}>
        <SheetContent className="w-full sm:w-[480px] md:w-[640px] overflow-y-auto">
          <SheetHeader className="pb-6">
            <SheetTitle>Product Details</SheetTitle>
            <SheetDescription>Complete product information</SheetDescription>
          </SheetHeader>

          {selectedProduct && (
            <div className="space-y-8 px-2">
              {/* Product Images Carousel */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className="text-sm font-medium text-gray-900">Images</h4>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <span className="text-xs text-gray-500">Use ← → keys to navigate</span>
                  )}
                </div>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative w-full">
                      <div className="aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-lg relative">
                        {imageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          </div>
                        )}
                        <Image
                          src={selectedProduct.images[currentImageIndex].url}
                          alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          priority
                          onLoadStart={() => setImageLoading(true)}
                          onLoad={() => setImageLoading(false)}
                          onError={() => setImageLoading(false)}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      {selectedProduct.images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                            onClick={goToPrevImage}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                            onClick={goToNextImage}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {selectedProduct.images.length > 1 && (
                      <div className="space-y-2">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                          {selectedProduct.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => goToImage(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                index === currentImageIndex
                                  ? 'border-blue-500 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={image.url}
                                alt={`${selectedProduct.name} - Thumbnail ${index + 1}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {currentImageIndex + 1} of {selectedProduct.images.length} images
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square max-w-sm mx-auto rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">No images available</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
                <div className="grid gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 min-w-[80px]">Product ID:</span>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded border text-right break-all ml-2">
                      {selectedProduct.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-right ml-2 flex-1">
                      {selectedProduct.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 min-w-[80px]">Slug:</span>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded border text-right break-all ml-2">
                      {selectedProduct.slug || 'N/A'}
                    </span>
                  </div>
                  {selectedProduct.description && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-gray-600">Description:</span>
                      <span className="text-sm text-gray-800 bg-white p-3 rounded border leading-relaxed">
                        {selectedProduct.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Pricing & Inventory</h4>
                <div className="grid gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                  </div>
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {selectedProduct.discount}%
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <Badge
                      variant={selectedProduct.stock! > 0 ? 'default' : 'destructive'}
                      className="text-sm px-3 py-1"
                    >
                      {selectedProduct.stock} units
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Final Price:</span>
                    <span className="text-lg font-semibold text-shop_dark_green">
                      {formatCurrency(
                        selectedProduct.discount
                          ? selectedProduct.price * (1 - selectedProduct.discount / 100)
                          : selectedProduct.price,
                      )}
                    </span>
                  </div>
                  {(selectedProduct.discount || 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">You Save:</span>
                      <span className="text-sm font-medium text-green-700">
                        {formatCurrency((selectedProduct.price * selectedProduct.discount!) / 100)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Availability:</span>
                    <Badge
                      variant={
                        selectedProduct.status === 'DISCONTINUED' ||
                        selectedProduct.status === 'OUT_OF_STOCK' ||
                        (selectedProduct.stock || 0) <= 0
                          ? 'destructive'
                          : 'default'
                      }
                      className="px-3 py-1"
                    >
                      {selectedProduct.status === 'DISCONTINUED'
                        ? 'Discontinued'
                        : (selectedProduct.stock || 0) > 0
                          ? 'In Stock'
                          : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Categories & Brand */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Classification</h4>
                <div className="grid gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                      <Tag className="w-3 h-3" />
                      {selectedProduct.categories?.[0].title || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category Slug:</span>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded border">
                      {selectedProduct.categories?.[0]?.slug || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Brand:</span>
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                      <Package2 className="w-3 h-3" />
                      {selectedProduct.brand?.name || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Brand Slug:</span>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded border">
                      {selectedProduct.brand?.slug || 'N/A'}
                    </span>
                  </div>
                  {selectedProduct.variant && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Product Type:</span>
                      <Badge variant="secondary" className="px-3 py-1">
                        {selectedProduct.variant}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Status & Features */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Status & Features</h4>
                <div className="grid gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={getStatusColor(selectedProduct.status!)} className="px-3 py-1">
                      {formatStatusLabel(selectedProduct.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Featured:</span>
                    <Badge
                      variant={selectedProduct.isFeatured ? 'default' : 'outline'}
                      className="px-3 py-1"
                    >
                      {selectedProduct.isFeatured ? (
                        <>
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </>
                      ) : (
                        'Not Featured'
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rating:</span>
                    <span className="text-sm font-medium bg-white px-3 py-1 rounded border">
                      {selectedProduct.averageRating != null
                        ? `${selectedProduct.averageRating.toFixed(1)} / 5`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Reviews:</span>
                    <span className="text-sm font-medium bg-white px-3 py-1 rounded border">
                      {selectedProduct.totalReviews ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Metadata */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Metadata</h4>
                <div className="grid gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Product ID:</span>
                    <span className="text-sm font-mono bg-white px-3 py-1 rounded border">
                      {selectedProduct.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created:</span>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded border">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedProduct.createdAt)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded border">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedProduct.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
