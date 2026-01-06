import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Navbar from "@/components/shared/Navbar";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foliage - Fresh Hydroponic Produce",
  description: "Premium hydroponic greens and herbs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}