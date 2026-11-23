import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/store/theme-context';
import { AuthProvider } from '@/lib/store/auth-context';
import { CartProvider } from '@/lib/store/cart-store';
import { OrderProvider } from '@/lib/store/order-store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'MILLET CAFE – Organic & Wholesome Food Delivery',
  description:
    'Order fresh millet bowls, stone-ground ragi wraps, cold-pressed brews, and healthy snacks delivered across campus.',
  keywords: ['millet cafe', 'campus food delivery', 'healthy food', 'ragi wraps', 'millet bowls'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-black dark:bg-[#0A0A0A] dark:text-[#EDEDED] transition-colors duration-200 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
