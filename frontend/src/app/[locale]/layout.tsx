import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

// Import providers and components
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SocketProvider } from '@/components/layout/SocketProvider';
import { ToastProvider } from '@/components/layout/ToastProvider';

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'si' }, { locale: 'ta' }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  const supportedLocales = ['en', 'si', 'ta'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SocketProvider>
          <ToastProvider>
            <div className="relative min-h-screen">
              {children}
            </div>
          </ToastProvider>
        </SocketProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}