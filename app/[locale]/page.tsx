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

export default function Index() {
  const t = useTranslations('sarc');
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/guide"
    //router.push("/guide");
  }, [])

  return (
    <div></div>
    // <div className="flex flex-row h-full items-center justify-around">
    //   <Card className="w-1/5 h-5/6 xl:h-4/6">
    //     <CardHeader>
    //       <CardTitle>既有用戶使用已綁定卡號</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <hr></hr>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-row space-y-1.5">
    //           <div className={"mt-4 " + table_text_size} >
    //             直接到量測站，嗶卡進行量測
    //           </div>
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex items-center justify-between">
    //     </CardFooter>
    //   </Card>

    //   <Card className="w-1/5 h-5/6 xl:h-4/6">
    //     <CardHeader>
    //       <CardTitle>既有用戶使用新卡號</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <hr></hr>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-row space-y-1.5">
    //           <div className={" " + table_text_size} >
    //             <div className="mt-4 flex flex-row justify-start">
    //               <div className="w-[20px]">1.</div>
    //               <div>點擊頁面上方的「開始」</div>
    //             </div>
    //             <div className="mt-4 flex flex-row justify-start">
    //               <div className="w-[24px]">2.</div>
    //               <div>在「姓名」輸入名字，點擊搜尋到既有用戶的名字</div>
    //             </div>
    //             <img src="/img/guide-2-1.png"></img>
    //             <div className="mt-4 flex flex-row justify-start">
    //               <div className="w-[24px]">3.</div>
    //               <div>清空「卡號」，在讀卡機上嗶新卡片，新卡號輸入後，點擊右下角「儲存資料」按鈕</div>
    //             </div>
    //             <img src="/img/guide-2-2.png"></img>
    //             <div className="mt-4 flex flex-row justify-start">
    //               <div className="w-[24px]">4.</div>
    //               <div>儲存成功後，請拿新卡片到量測站，嗶卡進行量測</div>
    //             </div>

    //           </div>
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex items-center justify-between">
    //     </CardFooter>
    //   </Card>

    //   <Card className="w-1/5 h-4/5 xl:h-1/2">
    //     <CardHeader>
    //       <CardTitle>既有用戶使用已綁定卡號</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <hr></hr>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-row space-y-1.5">
    //           <Label className={"mt-4 " + table_text_size} >
    //             直接到量測站，嗶卡進行量測
    //           </Label>
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex items-center justify-between">
    //     </CardFooter>
    //   </Card>

    //   <Card className="w-1/5 h-4/5 xl:h-1/2">
    //     <CardHeader>
    //       <CardTitle>既有用戶使用已綁定卡號</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <hr></hr>
    //       <div className="grid w-full items-center gap-4">
    //         <div className="flex flex-row space-y-1.5">
    //           <Label className={"mt-4 " + table_text_size} >
    //             直接到量測站，嗶卡進行量測
    //           </Label>
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex items-center justify-between">
    //     </CardFooter>
    //   </Card>

    // </div>

  );
}