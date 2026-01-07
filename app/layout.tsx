import type { Metadata } from "next";
import { Kalam, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import Navbar from "@/components/shared/Navbar";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Footer } from "@/components/shared/Footer";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-heading",
});

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
      <body className={`${nunito.variable} ${kalam.variable}`}>
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
