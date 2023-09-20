'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { table_text_size } from "@/Settings/settings"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Index(props: any) {
  console.log("in guide", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  useEffect(() => {
    //window.location.href = "/start"
    //router.push("/start");
  }, [])

  return (

    <div className="flex flex-row h-full items-center justify-evenly">
      <Card className="w-1/4 h-5/6 xl:h-4/6">
        <CardHeader>
          <CardTitle>{t('guide-1-title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <hr></hr>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row space-y-1.5">
              <div className={"mt-4 " + table_text_size} >
                {t('guide-1-msg')}
              </div>
            </div>
            <img src="/img/ibox-beep.jpg" className="rounded-2xl mt-12"></img>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
        </CardFooter>
      </Card>

      <Card className="w-1/4 h-5/6 xl:h-4/6">
        <CardHeader>
          <CardTitle>{t('guide-2-title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <hr></hr>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row space-y-1.5">
              <div className={" " + table_text_size} >
                <div className="mt-4 flex flex-row justify-start">
                  <div className="]">1.</div>
                  <div className="ml-3">{t('guide-2-1-msg')}</div>
                </div>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">2.</div>
                  <div className="ml-2">{t('guide-2-2-msg')}</div>
                </div>
                <img src="/img/guide-2-1.png"></img>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">3.</div>
                  <div className="ml-2">{t('guide-2-3-msg')}</div>
                </div>
                <img src="/img/guide-2-2.png"></img>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">4.</div>
                  <div className="ml-2">{t('guide-2-4-msg')}</div>
                </div>

              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
        </CardFooter>
      </Card>

      <Card className="w-1/4 h-5/6 xl:h-4/6">
        <CardHeader>
          <CardTitle>{t('guide-3-title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <hr></hr>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row space-y-1.5">
              <div className={" " + table_text_size} >
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">1.</div>
                  <div className="ml-3">{t('guide-2-1-msg')}</div>
                </div>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">2.</div>
                  <div className="ml-2">{t('guide-3-2-msg')}</div>
                </div>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">3.</div>
                  <div className="ml-2">{t('guide-2-3-msg')}</div>
                </div>
                <div className="mt-4 flex flex-row justify-start">
                  <div className="">4.</div>
                  <div className="ml-2">{t('guide-2-4-msg')}</div>
                </div>

              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
        </CardFooter>
      </Card>

    </div>

  );
}