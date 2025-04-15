// middleware.js
import { NextResponse } from "next/server";
import { getUserRole } from "@/hooks/useAuthStore";

export async function middleware(req) {
  const uid = req.cookies.uid;

  // Access the uid cookie using the get method
  const UID = req.cookies.get("uid")?.value;

  // Helper function to check access
  const pathname = req.nextUrl.pathname
  const publicPaths = ["/login", "/signup"];
  const protectedPaths = ["/checkout", "/orders", "/profile"];
  const adminPaths = ["/protected/admin", "/protected", "/admin"];

  // Check if the logged in user is trying to access publicPaths
  if (publicPaths.includes(pathname) && UID) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if logged in
  }

  // Check if the user is trying to access protectedPaths without logging in
  if (protectedPaths.includes(pathname) && UID == undefined) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect if not logged in
  }

  if (!uid) {
    return NextResponse.next(); // Allow access to home page
  }

  let userRole;
  try {
    userRole = await getUserRole(UID);
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.redirect("/login"); // Redirect to login on error
  }

  // Check if the user is an admin for admin routes
  if (adminPaths.includes(pathname) && (UID == undefined || userRole !== "admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Attach userRole and uid to the request object for further use
  req.userRole = userRole;
  req.uid = uid;

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected", "/admin", "/protected/admin", "/login", "/signup", "/profile", "/orders", "/checkout", "/"],
};
