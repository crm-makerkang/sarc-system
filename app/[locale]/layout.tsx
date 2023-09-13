
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
  return [{ locale: 'en' }, { locale: 'zh-tw' }, { locale: 'zh-cn' }, { locale: 'ja' }];
}

// export default async function LocaleLayout({ children, params: { locale } }: any) {
export default async function LocaleLayout(props: any) {
  console.log(props);
  let messages;
  try {
    messages = (await import(`../../messages/${props.params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={props.params.locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={props.params.locale} messages={messages} >
          <div className='h-2 w-full bg-orange-500'></div>
          <div className='h-4 w-full '></div>
          <Header forTest />
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}