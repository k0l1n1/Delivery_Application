import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/store/auth-context';
import { CartProvider } from '@/lib/store/cart-store';
import { OrderProvider } from '@/lib/store/order-store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSwitcherBar from '@/components/layout/RoleSwitcherBar';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'NOIR – Good Food. Delivered Differently.',
  description:
    'Experience curated fine dining and culinary excellence delivered to your residence with minimalist precision.',
  keywords: ['food delivery', 'fine dining', 'gourmet', 'noir', 'luxury food delivery'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <RoleSwitcherBar />
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
