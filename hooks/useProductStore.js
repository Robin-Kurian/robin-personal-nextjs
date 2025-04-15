import { create } from "zustand";
import { PRODUCTS } from "@/utilities/functions";

const useProductStore = create((set, get) => ({
  // Store products by category
  categoryProducts: {
    all: {
      products: [],
      lastVisible: null,
      hasMore: true
    }
  },
  currentCategory: 'all',
  loading: false,
  error: null,

  // Get current category's products
  getCurrentProducts: () => {
    const { categoryProducts, currentCategory } = get();
    return categoryProducts[currentCategory]?.products || [];
  },

  // Get if there are more products to load
  hasMoreProducts: () => {
    const { categoryProducts, currentCategory } = get();
    return categoryProducts[currentCategory]?.hasMore ?? true;
  },

  // Get current category's lastVisible
  getCurrentLastVisible: () => {
    const { categoryProducts, currentCategory } = get();
    return categoryProducts[currentCategory]?.lastVisible;
  },

  setProducts: (products) => {
    const { currentCategory } = get();
    set(state => ({
      categoryProducts: {
        ...state.categoryProducts,
        [currentCategory]: {
          ...state.categoryProducts[currentCategory],
          products
        }
      }
    }));
  },

  // Initialize or switch to a category
  initializeCategory: (categoryId = 'all') => {
    set(state => {
      const normalizedCategoryId = categoryId || 'all';
      // Only initialize if category doesn't exist
      if (!state.categoryProducts[normalizedCategoryId]) {
        return {
          categoryProducts: {
            ...state.categoryProducts,
            [normalizedCategoryId]: {
              products: [],
              lastVisible: null,
              hasMore: true
            }
          }
        };
      }
      return state;
    });
    set({ currentCategory: categoryId || 'all' });
  },

  getProducts: async (db, categoryId = null) => {
    const normalizedCategoryId = categoryId || 'all';
    set({ loading: true, currentCategory: normalizedCategoryId });

    try {
      const result = await PRODUCTS.GET_CATEGORY_PRODUCTS(db, categoryId);

      set(state => ({
        categoryProducts: {
          ...state.categoryProducts,
          [normalizedCategoryId]: {
            products: result.products || [],
            lastVisible: result.lastVisible,
            hasMore: result.hasMore
          }
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error:', error);
      set({ error: error.message, loading: false });
    }
  },

  loadMoreProducts: async (db, categoryId = null) => {
    const normalizedCategoryId = categoryId || 'all';
    const lastVisible = get().categoryProducts[normalizedCategoryId]?.lastVisible;
    const currentProducts = get().categoryProducts[normalizedCategoryId]?.products || [];

    // If we don't have lastVisible or hasMore is false, don't fetch
    if (!lastVisible || !get().categoryProducts[normalizedCategoryId]?.hasMore) {
      return;
    }

    set({ loading: true });

    try {
      const result = await PRODUCTS.GET_CATEGORY_PRODUCTS(db, categoryId, lastVisible);

      // Create a Set of existing product IDs for quick lookup
      const existingIds = new Set(currentProducts.map(p => p.id));

      // Filter out any duplicate products
      const newProducts = result.products.filter(p => !existingIds.has(p.id));

      set(state => ({
        categoryProducts: {
          ...state.categoryProducts,
          [normalizedCategoryId]: {
            products: [...currentProducts, ...newProducts],
            lastVisible: result.lastVisible,
            hasMore: result.hasMore && newProducts.length > 0 // Only set hasMore if we got new products
          }
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error:', error);
      set({ loading: false });
    }
  },

  // Reset a specific category
  resetCategory: (categoryId = 'all') => {
    const normalizedCategoryId = categoryId || 'all';
    set(state => ({
      categoryProducts: {
        ...state.categoryProducts,
        [normalizedCategoryId]: {
          products: [],
          lastVisible: null,
          hasMore: true
        }
      }
    }));
  },

  productDetails: null,
  setProductDetails: (product) => set({ productDetails: product }),
  quantity: 1,
  setQuantity: (quantity) => set({ quantity }),
}));

export default useProductStore;
