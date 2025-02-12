import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/common/Navbar/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <main id="home" className="flex-grow w-full min-h-full">
              <Navbar />
              {children}
            </main>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
