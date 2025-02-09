import { create } from "zustand";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Cookies from "js-cookie";

export const fetchUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  console.log(userDoc.data());
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
  setUser: (user) => {
    set({
      user,
      loading: false,
      role: user?.role || null,
      name: user?.name || null,
      isLoggedIn: user ? true : false,
      isAdmin: user ? user.role === "admin" : false,
    });
  },
  clearUser: () => set({ user: null, loading: false, isAdmin: false }),
}));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const role = await getUserRole(user.uid);
    const name = (await fetchUserData(user.uid))?.name;
    useAuthStore.getState().setUser({ ...user, role, name });
  } else {
    useAuthStore.getState().clearUser();
  }
});

export const logout = async () => {
  await signOut(auth);
  Cookies.remove("uid");
  Cookies.remove("token");
  useAuthStore.getState().clearUser();
};

export default useAuthStore;
