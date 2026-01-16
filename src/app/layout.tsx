import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartFloatingButton } from "@/components/CartFloatingButton";
import { CartSync } from "@/components/CartSync";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "BMSCE Canteen Connect",
  description: "Order food from BMSCE campus canteens online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-gray-50/50`}>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <CartSync />
        <Navbar />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="min-h-screen">
            {children}
          </main>
          <CartFloatingButton />
        </ThemeProvider>
        <Toaster />
        <footer className="border-t bg-white py-12 w-full">
          <div className="flex flex-col items-center justify-center text-center text-gray-500 px-4">
            <p className="mb-2 font-bold text-orange-600">BMSCE Canteen Connect</p>
            <p className="text-sm font-medium">&copy; {new Date().getFullYear()} BMS College of Engineering. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
