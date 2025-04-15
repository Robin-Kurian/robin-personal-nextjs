"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import useAuthStore from "@/hooks/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";

const AuthProvider = ({ children }) => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await useAuthStore.getState().fetchUserData(firebaseUser.uid);
        setUser(userData); // Pass the complete user data
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <>{children}</>;
};

export default AuthProvider;
