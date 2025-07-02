import { NextIntlClientProvider } from 'next-intl';
import { Inter, Poppins, Fira_Code } from 'next/font/google';
import { Metadata } from 'next';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'AI-Powered Blog Platform',
    template: '%s | AI Blog Platform',
  },
  description: 'Modern AI-powered multilingual blog platform with cutting-edge animations and 3D effects',
  keywords: ['blog', 'AI', 'multilingual', 'animations', 'modern', 'platform'],
  authors: [{ name: 'AI Blog Platform Team' }],
  creator: 'AI Blog Platform',
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    title: 'AI-Powered Blog Platform',
    description: 'Modern AI-powered multilingual blog platform with cutting-edge animations and 3D effects',
    siteName: 'AI Blog Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Blog Platform',
    description: 'Modern AI-powered multilingual blog platform with cutting-edge animations and 3D effects',
    creator: '@aiblogplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${firaCode.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        <div id="root">
          {children}
        </div>
        
        {/* Particles container for global animations */}
        <div id="particles-js" className="fixed inset-0 pointer-events-none z-0" />
        
        {/* Three.js canvas container */}
        <div id="three-canvas" className="fixed inset-0 pointer-events-none z-0" />
        
        {/* Loading screen */}
        <div id="loading-screen" className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" style={{ display: 'none' }}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </body>
    </html>
  );
}