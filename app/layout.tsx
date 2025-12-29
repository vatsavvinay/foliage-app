import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import '@/app/globals.css';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { Providers } from '@/components/Providers';

const headingFont = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const bodyFont = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="bg-white text-neutral-900 font-body antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
