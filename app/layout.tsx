import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Bodoni_Moda, Inter, Space_Mono } from 'next/font/google';
import AiConcierge from '@/components/ai/AiConcierge';
import JsonLd from '@/components/site/JsonLd';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';
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

export const viewport: Viewport = {
  themeColor: '#040B24',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Frequency Wave',
    'Frequency Wave Unplugged',
    'Web3 Kenya',
    'Kilifi',
    'Nairobi',
    'music and culture',
    'ETHSafari',
    'tech entertainment',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'events',
  alternates: { canonical: '/' },
  icons: {
    icon: '/images/fw-mark.png',
    apple: '/images/fw-mark.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} Unplugged — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@The_wave_Africa',
    creator: '@The_wave_Africa',
    title: `${SITE_NAME} Unplugged — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body
        className={`${bodoni.variable} ${bebas.variable} ${inter.variable} ${spaceMono.variable} bg-[#040B24] text-white antialiased`}
      >
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
        <AiConcierge />
      </body>
    </html>
  );
}
