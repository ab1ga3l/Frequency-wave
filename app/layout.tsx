import type { Metadata } from 'next';
import { Inter, Montserrat, Space_Mono } from 'next/font/google';
import AiConcierge from '@/components/ai/AiConcierge';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
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
        className={`${montserrat.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
        <AiConcierge />
      </body>
    </html>
  );
}
