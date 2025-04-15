import { create } from "zustand";
import CART_API from "@/utilities/api/cart.api";
import useAuthStore from "@/hooks/useAuthStore";
import Cookies from "js-cookie";

const useCartStore = create((set, get) => ({
  products: [],
  selectedProducts: {},

  setProducts: (products) => {
    set((state) => {
      if (typeof window !== "undefined") {
        if (!Cookies.get("uid")) {
          localStorage.setItem("cartItems", JSON.stringify(products));
        }
      }
      return { products };
    });
  },

  setSelectedProducts: (selectedProducts) => set({ selectedProducts }),

  clearCart: () => set({ products: [] }),

  addProduct: async (product) => {
    const { user } = useAuthStore.getState();

    if (user?.uid) {
      // Add to Firebase if logged in
      await CART_API.addProductToCart(product, user.uid);
      // Fetch updated cart after adding
      const { data } = await CART_API.getProductsInCart(user.uid);
      set({ products: data });
    } else {
      const existingProducts = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingProduct = existingProducts.find((p) => p.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += product.quantity || 1;
        localStorage.setItem("cartItems", JSON.stringify(existingProducts));
        set({ products: existingProducts });
      } else {
        const updatedProducts = [...existingProducts, product];
        localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
        set({ products: updatedProducts });
      }
    }
  },

  fetchCart: async () => {
    const { products } = get();
    if (products.length > 0) return;

    const { user } = useAuthStore.getState();
    if (user?.uid) {
      const { data } = await CART_API.getProductsInCart(user.uid);
      set({ products: data });
    }
  },

  syncCartWithFirebase: async (userId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (localCart.length > 0) {
        // First get existing cart items from Firebase
        const { data: existingCartItems } = await CART_API.getProductsInCart(userId);

        for (const localProduct of localCart) {
          // Check if product with same variants exists
          const existingProduct = existingCartItems.find(p =>
            p.id === localProduct.id &&
            JSON.stringify(p.variants) === JSON.stringify(localProduct.variants)
          );

          if (existingProduct) {
            // Update quantity of existing product
            await CART_API.updateProductQuantityInCart(
              existingProduct.id,
              existingProduct.quantity + localProduct.quantity,
              userId
            );
          } else {
            // Add new product
            await CART_API.addProductToCart(localProduct, userId);
          }
        }

        // Clear local cart after successful sync
        localStorage.removeItem("cartItems");
      }

      // Fetch updated cart from Firebase
      const { data } = await CART_API.getProductsInCart(userId);
      set({ products: data });
    } catch (error) {
      console.error("Error syncing cart:", error);
      throw error; // Propagate error for handling
    }
  },
}));

export default useCartStore;
