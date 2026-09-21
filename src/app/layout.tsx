import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import AuthProvider from '@/components/auth/AuthProvider';
import StoreProvider from '@/store/StoreProvider';

export const metadata: Metadata = {
  title: 'StockPro',
  description:
    'Product inventory and analytics dashboard',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}