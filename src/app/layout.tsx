import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuminaAI — Task Management',
  description: 'AI-Powered Task Management SaaS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
