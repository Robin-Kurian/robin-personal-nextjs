// middleware.js
import { NextResponse } from "next/server";
import { getUserRole } from "@/hooks/useAuthStore";

export async function middleware(req) {
  const uid = req.cookies.uid;

  if (!uid) {
    return NextResponse.next(); // Allow access to home page
  }

  let userRole;
  try {
    userRole = await getUserRole(uid);
  } catch (error) {
    console.log("User is not an admin, redirecting...");
    return NextResponse.redirect("/login");
  }
  // Check if the user is an admin
  if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
    // console.log("User is not an admin, redirecting...");
    return NextResponse.redirect("/");
  }

  req.userRole = userRole;
  req.uid = uid;

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/"],
};
