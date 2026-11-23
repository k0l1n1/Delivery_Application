import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/store/auth-context';
import { CartProvider } from '@/lib/store/cart-store';
import { OrderProvider } from '@/lib/store/order-store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'NOIR – Campus & Hostel Food Delivery',
  description:
    'Order late-night snacks, meals, and drinks delivered straight to your hostel room.',
  keywords: ['hostel food delivery', 'campus food', 'night canteen', 'student food delivery'],
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
