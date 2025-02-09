"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Cookies from "js-cookie";
import useAuthStore from "@/hooks/useAuthStore";
import Link from "next/link";

const provider = new GoogleAuthProvider();

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user); // Set user after successful signup
      // Create a new user document in Firestore with default role
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        role: "user",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });
      router.push("/");
      toast({
        variant: "success",
        title: "Account Created",
        description: "You have successfully signed up!",
      });
      Cookies.set("uid", user.uid, { path: "/", expires: 7 });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // Set user after successful signup
      // Create a new user document in Firestore with default role
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || name,
        role: "user",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });
      router.push("/");
      toast({
        variant: "success",
        title: "Account Created",
        description: "You have successfully signed up!",
      });
      Cookies.set("uid", user.uid, { path: "/", expires: 7 });
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
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleSignup}>
            <div className="space-y-1 mb-2">
              <label htmlFor="name" className="block text-xs font-medium pl-1">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border rounded-md p-2"
              />
            </div>
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
              href="/login"
              className="block text-xs font-medium pl-1 text-blue-600"
            >
              Already have an account? Login
            </Link>
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">or</span>
          </div>
          <div className="flex justify-center my-4">
            <Button
              onClick={handleGoogleSignup}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Sign up with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
