'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Languages, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { table_text_size } from "@/Settings/settings"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

// function LanguageButton() {
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
          className={"cursor-pointer "+table_text_size}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { window.location.href = "/zh-tw" }} 
          className={"cursor-pointer "+table_text_size}
        >
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { window.location.href = "/zh-cn" }} 
          className={"cursor-pointer "+table_text_size}
        >
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { window.location.href = "/ja" }} 
          className={"cursor-pointer "+table_text_size}
        >
          日本語
        </DropdownMenuItem>

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0"/>

        <DropdownMenuItem 
          className={"cursor-pointer "+table_text_size}
        >
          {t("s-font")}
        </DropdownMenuItem>

        <DropdownMenuItem 
          className={"cursor-pointer "+table_text_size}
        >
          {t("m-font")}
        </DropdownMenuItem>

        <DropdownMenuItem 
          className={"cursor-pointer "+table_text_size}
        >
          {t("l-font")}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0"/>

        <DropdownMenuItem 
          className={"cursor-pointer "+table_text_size}
        >
          {t("rows-per-page")}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="w-full h-0.5 bg-gray-300 border-0"/>

        <DropdownMenuItem 
          className={"cursor-pointer "+table_text_size}
        >
          {t("logout")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />


      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingButton;
