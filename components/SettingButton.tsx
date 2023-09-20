'use client'

import { useEffect } from "react"
// import { useRouter } from "next/navigation"
import { Languages, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
//import type { NextRequest } from 'next/server'


import * as React from "react"
import axios from "axios"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"

function SettingButton() {
  const t = useTranslations('sarc');

  //const router = useRouter();

  const [settings, setSettings] = React.useState({
    table_text_size: "",
    rows_per_page: "",
  })

  const [ipaddress, setIpaddress] = React.useState("");

  useEffect(() => {
    const getSettings = async () => {
      const res = await axios.get('/api/settings/')
      console.log("settings", res.data);
      setSettings({
        table_text_size: JSON.parse(res.data.message).table_text_size,
        rows_per_page: JSON.parse(res.data.message).rows_per_page
      })

    }

    const getIP = async () => {
      const res = await axios.get('/api/get_ip/')
      console.log("ip", res.data);
      setIpaddress(res.data);
    }

    getSettings();
    getIP();

  }, [])


  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <div>
          <Settings className="w-6 h-6 rotate-0 scale-100 transition-all " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className={"cursor-none " + settings.table_text_size} >
          IP: {ipaddress}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        {/* 以下 route 若用 router.push 會有不 reload 的奇怪行為，改用 window.location.href */}
        <DropdownMenuItem
          onClick={
            async () => {
              await axios.post('/api/cookie/',
                {
                  locale: "en",
                });
              window.location.href = "/en/guide";
            }
          }
          className={"cursor-pointer " + settings.table_text_size}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={
            async () => {
              await axios.post('/api/cookie/',
                {
                  locale: "zh-tw",
                });
              window.location.href = "/zh-tw/guide"
            }
          }
          className={"cursor-pointer " + settings.table_text_size}
        >
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { window.location.href = "/zh-cn/guide" }}
          className={"cursor-pointer " + settings.table_text_size}
        >
          简体中文
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          onClick={() => { window.location.href = "/ja/guide" }}
          className={"cursor-pointer " + settings.table_text_size}
        >
          日本語
        </DropdownMenuItem> */}

        {/* <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0" /> */}

        {/* <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  table_text_size: "text-sm",
                });
              window.location.reload();
            }
          }
        >
          {t("s-font")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  table_text_size: "text-lg",
                });
              window.location.reload();
            }
          }
        >
          {t("m-font")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  table_text_size: "text-xl",
                });
              window.location.reload();
            }
          }
        >
          {t("l-font")}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0" />

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  rows_per_page: '5 ',
                });
              window.location.reload();
            }
          }
        >
          5 {t("rows-per-page")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  rows_per_page: '8 ',
                });
              window.location.reload();
            }
          }
        >
          8 {t("rows-per-page")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.post('/api/settings/',
                {
                  rows_per_page: '10',
                });
              window.location.reload();
            }
          }
        >
          10 {t("rows-per-page")}
        </DropdownMenuItem> */}

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0" />

        <DropdownMenuItem
          className={"cursor-pointer " + settings.table_text_size}
          onClick={
            async () => {
              await axios.get('/api/logout/');
              window.location.href = "/guide";
            }
          }
        >
          {t("logout")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />


      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingButton;
