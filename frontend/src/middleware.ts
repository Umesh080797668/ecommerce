import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'si', 'ta'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale in URL
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(si|ta|en)/:path*']
};