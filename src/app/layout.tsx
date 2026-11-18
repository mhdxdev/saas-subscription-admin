import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaaSify Pro — Subscription Management & Admin Panel',
  description:
    'Comprehensive production-ready SaaS subscription admin panel with real-time state synchronization, revenue analytics, user lifecycle controls, and payment verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white`}>
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </body>
    </html>
  );
}
