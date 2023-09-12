'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Languages, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { table_text_size } from "@/Settings/settings"
import type { NextRequest } from 'next/server'

import axios from "axios"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

function SettingButton() {
  const t = useTranslations('sarc');

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <div>
          <Settings className="w-6 h-6 rotate-0 scale-100 transition-all " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {/* 以下 route 若用 router.push 會有不 reload 的奇怪行為，改用 window.location.href */}
        <DropdownMenuItem
          onClick={() => { window.location.href = "/en" }}
          className={"cursor-pointer " + table_text_size}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { window.location.href = "/zh-tw" }}
          className={"cursor-pointer " + table_text_size}
        >
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { window.location.href = "/zh-cn" }}
          className={"cursor-pointer " + table_text_size}
        >
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { window.location.href = "/ja" }}
          className={"cursor-pointer " + table_text_size}
        >
          日本語
        </DropdownMenuItem>

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0" />

        <DropdownMenuItem
          className={"cursor-pointer " + table_text_size}
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
          className={"cursor-pointer " + table_text_size}
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
          className={"cursor-pointer " + table_text_size}
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
          className={"cursor-pointer " + table_text_size}
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
          className={"cursor-pointer " + table_text_size}
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
          className={"cursor-pointer " + table_text_size}
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
        </DropdownMenuItem>

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0" />

        <DropdownMenuItem
          className={"cursor-pointer " + table_text_size}
          onClick={
            async () => {
              await axios.get('/api/logout/');
              window.location.href = "/start";
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
