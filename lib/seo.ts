/** Site URL, default copy, and JSON-LD helpers for public SEO. */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://frequency-wave-nine.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Frequency Wave';
export const SITE_TAGLINE = 'Where Web3 Meets Music & Culture';
export const SITE_DESCRIPTION =
  'Frequency Wave is Africa’s tech-entertainment movement from Nairobi. Frequency Wave Unplugged — 11 September 2026 in Kilifi, Kenya — where Web3 meets music and culture. Limited capacity, RSVP required.';
export const DEFAULT_OG_IMAGE = '/images/fw-mark.png';
export const SITE_EMAIL = 'frequencywave101@gmail.com';
export const UNPLUGGED_RSVP_URL = 'https://luma.com/4bval6lt';

export function eventRsvpUrl(event: { slug: string; registerUrl?: string | null }) {
  if (event.registerUrl) return event.registerUrl;
  if (event.slug === 'ethsafari-2026') return UNPLUGGED_RSVP_URL;
  return null;
}

export function absUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: SITE_EMAIL,
    logo: absUrl('/images/fw-mark.png'),
    image: absUrl(DEFAULT_OG_IMAGE),
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    sameAs: [
      'https://x.com/The_wave_Africa',
      'https://instagram.com/the_wave_africa',
      'https://www.tiktok.com/@the_wave_africa',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}

export function eventJsonLd(event: {
  title: string;
  description: string;
  tagline?: string | null;
  startAt: Date;
  endAt?: Date | null;
  venue: string;
  city: string;
  country: string;
  coverImage?: string | null;
  registerUrl?: string | null;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.tagline || event.description.slice(0, 300),
    startDate: event.startAt.toISOString(),
    endDate: event.endAt?.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: absUrl(event.coverImage || DEFAULT_OG_IMAGE),
    url: absUrl(`/events/${event.slug}`),
    location: {
      '@type': 'Place',
      name: event.venue || event.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: event.country === 'Kenya' ? 'KE' : event.country,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      email: SITE_EMAIL,
    },
    offers: eventRsvpUrl(event)
      ? {
          '@type': 'Offer',
          url: eventRsvpUrl(event),
          availability: 'https://schema.org/LimitedAvailability',
        }
      : undefined,
  };
}
