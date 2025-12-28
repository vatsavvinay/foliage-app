import type { Metadata } from 'next';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import '@/app/globals.css';
import { CartProvider } from '@/components/storefront/CartContext';
import { CartDrawer } from '@/components/storefront/CartDrawer';

export const metadata: Metadata = {
  title: 'Foliage - Sustainable E-commerce',
  description: 'Discover eco-friendly products for sustainable living',
  icons: {
    icon: '🌿',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
