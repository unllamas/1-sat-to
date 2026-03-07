import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { Analytics } from '@vercel/analytics/next';

import { ThemeProvider } from '@/lib/theme-context';

import './globals.css';

export const metadata: Metadata = {
  title: '1 SAT = ? MXN | Precio del Satoshi en tiempo real',
  description:
    'Visualiza en tiempo real el valor de un Satoshi en pesos mexicanos y otras monedas de Latinoamerica. Incluye calculadora y graficos historicos.',
  keywords: ['bitcoin', 'satoshi', 'sat', 'mxn', 'peso mexicano', 'criptomonedas', 'precio bitcoin'],
  authors: [{ name: '1 SAT = 1 Peso' }],
  openGraph: {
    title: '1 SAT = ? MXN',
    description: 'Precio del Satoshi en tiempo real',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${GeistSans.className} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
