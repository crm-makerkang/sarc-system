
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'SARC-System',
  description: '',
}

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'zh-tw'}, {locale: 'zh-cn'}, {locale: 'ja'}];
}

export default async function LocaleLayout({ children, params: { locale } }: any) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header forTest />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}