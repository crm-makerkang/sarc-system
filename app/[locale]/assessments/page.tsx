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

import { jsPDF } from "jspdf"

export default function Index(props: any) {
  console.log("in guide", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  useEffect(() => {
    //window.location.href = "/start"
    //router.push("/start");
  }, [])

  return (

    <div className="mt-4 flex flex-col w-full items-center justify-evenly ">

      <div id="pdf_test" className="flex flex-row space-x-4 w-full ">
          <div className="bg-gray-200 p-1 rounded-md">User</div>
          <div className="bg-gray-200 p-1 rounded-md">Report</div>
          <div className="bg-gray-200 p-1 rounded-md">Standard</div>
      </div>

      <Button onClick={
        () => {
          var html_div = document.querySelector("#pdf_test");             
          var doc = new jsPDF('p', 'mm');
          doc.html(html_div, {
            callback: function (doc) {
              doc.save("test.pdf");
            },
            x: 15,
            y: 15,
            width: 170,
            windowWidth: 650
          })
        }
      }>generate pdf from canvas</Button>

      <div className="flex flex-row h-full w-11/12 items-top justify-evenly mt-4 rounded-2xl bg-gray-200">

        <div className="h-[800px] w-[20px]  flex flex-col items-center justify-around text-4xl ">
          <div>篩檢</div>
          <div>評估</div>
          <div>診斷</div>
        </div>

        <div className="h-[800px]  w-11/12 ">
          <div className="flex flex-row w-full items-center justify-center">
            <div className="flex flex-col w-2/5 h-full mx-4 items-center justify-center">
              <div className="mt-2 text-2xl">基層醫療或社區預防</div>

              <div className="w-full h-[800px] border-2 border-black flex flex-col items-center justify-top">
                <div className="mt-4 ml-4 p-4 border-2 border-black w-4/5 text-xl">
                  <div>{"小腿圍： 男<34公分，女<33公分"}</div>
                  <div>{"或 SARC-F 問卷 >= 4 分"}</div>
                  <div>{"或 SARC-CalF 問卷 >= 11 分"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-3/5 h-full mx-4 items-center justify-center">
              <div className="mt-2 text-2xl">急慢性照護或臨床研究</div>

              <div className="w-full h-[800px] border-2 border-black ">
                DDD
              </div>
            </div>

          </div>
        </div>

        {/* <Card className="w-11/12 h-[800px]">
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
        </Card> */}

      </div>

    </div>

  );
}