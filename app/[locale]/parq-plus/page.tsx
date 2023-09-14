// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { table_text_size } from "@/Settings/settings"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useTranslations } from "next-intl"

export default function ParqPlus() {
  const t = useTranslations('sarc');

  return (

    <div className='container flex items-start justify-center' 
    style={{
      backgroundImage: 'url(/img/bg-parq.jpg)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      height: '91vh', width: '100%'
    }}
    >
        <Card className="w-[550px] mt-16">
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="name">Hello</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" className={table_text_size}
              onClick={async () => {
                window.location.reload();
              }}
            >
              清除資料
            </Button>
            <Button className={'bg-primary  ' + table_text_size}
              onClick={async () => {
                alert("如果進行量測，您的個人資料和量測結果會被存入本機資料庫，但不會上傳到雲端。若有需要，您可以要求本機管理員刪除您的個人資料和量測結果");
              }}
            >
              進行量測
            </Button>
          </CardFooter>
        </Card>
    </div>
  );
}