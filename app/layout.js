import { Poppins, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer";

// const manrope = Manrope({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};


export const metadata = {
  metadataBase: new URL('https://babyparadiseweb.netlify.app'),
  title: {
    default: "Robin | Developer",
    template: "%s | Robin K"
  },
  description: "Let's build something amazing together",
  keywords: ["web development", "software engineering", "frontend development", "backend development", "JavaScript", "React", "Node.js", "API development"],
  authors: [{ name: "Robin Kurian" }],
  creator: "Robin Kurian",
  publisher: "Robin Kurian",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://robink.netlify.app',
    siteName: 'Robin | Developer',
    title: 'Robin K - SDE',
    description: 'Welcome to my portfolio! I specialize in web development, creating dynamic and responsive applications using modern technologies. Let\'s collaborate on your next project!',
    images: [
      {
        url: 'https://robink.netlify.app/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Developer Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robin K - Developer Portfolio',
    description: 'Welcome to my developer portfolio, showcasing my skills in web development, software engineering, and innovative projects.',
    images: ['https://robink.netlify.app/images/logo.png'],
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'Portfolio',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <AuthProvider>
          <Toaster />
          <main className="flex-grow font-light min-h-[calc(100vh-70px)]">
            <Navbar />
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
