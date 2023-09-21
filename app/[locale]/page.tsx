'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function Index() {
  const t = useTranslations('sarc');
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/guide"
    //router.push("/guide");
  }, [])

  return (
    <div></div>
  );
}