"use client";

import Loader from "./common/Loader";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import useAuthStore from "@/hooks/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "@/hooks/useAuthStore";

const AuthProvider = ({ children }) => {
  const { loading, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUser({ ...user, role });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [setUser]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default AuthProvider;
