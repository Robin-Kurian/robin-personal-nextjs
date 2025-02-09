"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/hooks/useAuthStore";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Cookies from "js-cookie";
import Link from "next/link";
const provider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "Account has been disabled.";
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/invalid-credential":
        return "Check your email and password.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/email-already-in-use":
        return "Account already exists.";
      case "auth/unauthorized-domain":
        return "Service temporarily unavailable.";
      case "auth/cancelled-popup-request":
        return "Popup was cancelled.";
      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";
      default:
        return "An error occurred: " + errorCode;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      Cookies.set("uid", user.uid, { path: "/", expires: 7 });
      router.push("/");
    } catch (error) {
      const formattedError = getErrorMessage(error.code);

      toast({
        variant: "destructive",
        title: "Error",
        description: formattedError,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User does not exist in Firestore, redirect to signup
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: "You need to sign up first.",
        });
        await auth.signOut(); // Sign out the user from Firebase Authentication
        router.push("/signup"); // Redirect to signup page
        return;
      }

      // If the user exists, set the user in the auth store
      setUser(user);
      Cookies.set("uid", user.uid, { path: "/", expires: 7 }); // Set the uid cookie
      router.push("/"); // Redirect to home page after successful login
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Login</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 mb-2">
              <label htmlFor="email" className="block text-xs font-medium pl-1">
                Email
              </label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-md p-2"
              />
            </div>
            <div className="space-y-1 mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium pl-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-md p-2"
              />
            </div>
            <Link
              href="/signup"
              className="block text-xs font-medium pl-1 text-blue-600"
            >
              Don&apos;t have an account? Sign up
            </Link>
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">or</span>
          </div>
          <div className="flex justify-center mb-4">
            <Button
              onPress={handleGoogleSignIn}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
