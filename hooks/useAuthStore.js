import { create } from "zustand";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import Cookies from "js-cookie";
import useProductStore from "@/hooks/useProductStore";
import useCartStore from "@/hooks/useCartStore";

export const fetchUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const getUserRole = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data().role;
};

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAdmin: false,
  isLoggedIn: false,

  // Initialize from cookies immediately
  initializeFromCookies: () => {
    const uid = Cookies.get("uid");

    if (uid) {
      set({
        user: { uid },
        isLoggedIn: true,
        loading: true // Keep true until full data is fetched
      });
    }
  },

  setUser: (user) => {
    set({
      user,
      loading: false,
      isLoggedIn: !!user,
      isAdmin: user?.role === "admin",
    });
  },

  clearUser: () => {
    Cookies.remove("uid");
    set({ user: null, loading: false, isAdmin: false });
  },
  fetchUserData: async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  },
  initFunctions: () => {
    localStorage.removeItem("cartItems");
    sessionStorage.removeItem('selectedProducts');
  },
  logout: async () => {
    await signOut(auth);
    Cookies.remove("uid");
    Cookies.remove("token");
    useProductStore.setState({ products: [], productDetails: null });
    useCartStore.setState({ products: [], selectedProducts: {} });
    set({ user: null, loading: false, isAdmin: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("products");
      sessionStorage.removeItem('selectedProducts');
    }
  },
}));

// Initialize from cookies immediately when store is created
useAuthStore.getState().initializeFromCookies();

// Then handle Firebase auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userData = await fetchUserData(user.uid);
    useAuthStore.getState().setUser(userData);

    // Sync cart data when user logs in
    try {
      await useCartStore.getState().syncCartWithFirebase(user.uid);
    } catch (error) {
      console.error("Failed to sync cart:", error);
      // Don't throw error here to avoid blocking auth flow
    }
  } else {
    useAuthStore.getState().setUser(null);
  }
});

export default useAuthStore;
