import type { Metadata } from 'next';
import { Bebas_Neue, Bodoni_Moda, Inter, Space_Mono } from 'next/font/google';
import AiConcierge from '@/components/ai/AiConcierge';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Frequency Wave — Where Tech Meets Entertainment',
  description:
    "Africa's tech-entertainment movement — where Web3 meets culture, builders meet creators, and the future gets built in real time.",
  openGraph: {
    title: 'Frequency Wave — Where Tech Meets Entertainment',
    description: "Africa's premier Web3 & culture event experience.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bodoni.variable} ${bebas.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
        <AiConcierge />
      </body>
    </html>
  );
}
