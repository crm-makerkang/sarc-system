'use client';
import { useTranslations } from 'next-intl';

export default function Index() {
  const t = useTranslations('sarc');
  return <h1>{t('language')}</h1>;
}