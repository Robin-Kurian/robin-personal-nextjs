import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/common/Navbar/Navbar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Robin | Developer",
  description: "Let's build something amazing together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            {/* <SidebarProvider> */}
            {/* <AppSidebar /> */}
            <main className="flex-grow w-full min-h-screen">
              <Navbar />
              {children}
            </main>
            {/* </SidebarProvider> */}
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
