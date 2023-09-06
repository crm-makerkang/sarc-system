'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { Button } from "./ui/button"

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
function LanguageButton() {

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <div>
          <Languages className="w-6 h-6 rotate-0 scale-100 transition-all " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {/* 以下 route 若用 router.push 會有不 reload 的奇怪行為，改用 window.location.href */}
        <DropdownMenuItem onClick={() => { window.location.href = "/en" }} className="cursor-pointer">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = "/zh-tw" }} className="cursor-pointer">
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = "/zh-cn" }} className="cursor-pointer">
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = "/ja" }} className="cursor-pointer">
          日本語
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageButton;
