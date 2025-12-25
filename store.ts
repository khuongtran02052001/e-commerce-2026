import _ from 'lodash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from './mock-data';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: IProduct) => void;
  addMultipleItems: (products: Array<{ product: IProduct; quantity: number }>) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getTotalDiscount: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  // favorite
  favoriteProduct: IProduct[];
  addToFavorite: (product: IProduct) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  // order placement state
  isPlacingOrder: boolean;
  orderStep: 'validating' | 'creating' | 'emailing' | 'redirecting';
  setOrderPlacementState: (
    isPlacing: boolean,
    step?: 'validating' | 'creating' | 'emailing' | 'redirecting',
  ) => void;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = _.find(state.items, (item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: _.map(state.items, (item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      addMultipleItems: (products) =>
        set((state) => {
          let updatedItems = [...state.items];

          _.forEach(products, ({ product, quantity }) => {
            const existingItem = _.find(updatedItems, (item) => item.product.id === product.id);

            if (existingItem) {
              updatedItems = _.map(updatedItems, (item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              );
            } else {
              updatedItems.push({ product, quantity });
            }
          });

          return { items: updatedItems };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: _.reduce(
            state.items,
            (acc: CartItem[], item) => {
              if (item.product.id === productId) {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else {
                acc.push(item);
              }
              return acc;
            },
            [] as CartItem[],
          ),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: _.filter(state.items, ({ product }) => product?.id !== productId),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        // This should be the final payable amount (current/discounted prices)
        return _.reduce(
          get().items,
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0,
        );
      },
      getSubTotalPrice: () => {
        // This should be the gross amount (before discount)
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            const grossPrice = currentPrice + discountAmount;
            return total + grossPrice * item.quantity;
          },
          0,
        );
      },
      getTotalDiscount: () => {
        // New function to get total discount amount
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            return total + discountAmount * item.quantity;
          },
          0,
        );
      },
      getItemCount: (productId) => {
        const item = _.find(get().items, (item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      addToFavorite: (product: IProduct) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = _.some(state.favoriteProduct, (item) => item.id === product.id);
            return {
              favoriteProduct: isFavorite
                ? _.filter(state.favoriteProduct, (item) => item.id !== product.id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: _.filter(state.favoriteProduct, (item) => item?.id !== productId),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
      // order placement state
      isPlacingOrder: false,
      orderStep: 'validating' as const,
      setOrderPlacementState: (isPlacing, step = 'validating') => {
        set({
          isPlacingOrder: isPlacing,
          orderStep: step,
        });
      },
    }),
    { name: 'cart-store' },
  ),
);

export default useCartStore;
