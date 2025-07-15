import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SessionWrapper } from '@/components/auth/session-wrapper';
import { I18nProvider } from '@/i18n/I18nProvider';
import { DemoIndicator } from '@/components/demo-banner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'DkNex - Advanced Form Builder Platform',
    template: '%s | DkNex'
  },
  description: 'Professional form builder dashboard with drag-and-drop interface, real-time analytics, and enterprise-grade features. Build, manage, and analyze forms with ease.',
  keywords: [
    'form builder',
    'drag and drop',
    'form creator',
    'survey builder',
    'form analytics',
    'Next.js',
    'React',
    'TypeScript',
    'enterprise forms'
  ],
  authors: [{ name: 'DkNex Team' }],
  creator: 'DkNex',
  publisher: 'DkNex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dknex.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'de-DE': '/de',
    },
  },
  openGraph: {
    title: 'DkNex - Advanced Form Builder Platform',
    description: 'Professional form builder dashboard with drag-and-drop interface, real-time analytics, and enterprise-grade features.',
    url: 'https://dknex.vercel.app',
    siteName: 'DkNex',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DkNex Form Builder Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DkNex - Advanced Form Builder Platform',
    description: 'Professional form builder dashboard with drag-and-drop interface, real-time analytics, and enterprise-grade features.',
    images: ['/og-image.png'],
    creator: '@dknex',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Business Software',
  referrer: 'origin-when-cross-origin',
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DkNex',
    startupImage: [
      '/apple-touch-icon.png',
    ],
  },
  applicationName: 'DkNex',
  appLinks: {
    web: {
      url: 'https://dknex.vercel.app',
      should_fallback: true,
    },
  },
  archives: ['https://dknex.vercel.app/sitemap.xml'],
  assets: ['https://dknex.vercel.app/assets'],
  bookmarks: ['https://dknex.vercel.app/bookmarks'],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'DkNex',
              description: 'Professional form builder dashboard with drag-and-drop interface, real-time analytics, and enterprise-grade features.',
              url: 'https://dknex.vercel.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'DkNex Team',
              },
              softwareVersion: '1.0.0',
              datePublished: '2024-01-01',
              dateModified: new Date().toISOString(),
              screenshot: 'https://dknex.vercel.app/og-image.png',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <I18nProvider>
              {children}
              <DemoIndicator />
            </I18nProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
