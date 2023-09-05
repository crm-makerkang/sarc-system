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
  const [language, setlanguage] = useState("zh")

  const router = useRouter();

  useEffect(() => {
    setlanguage(router.locale)
  }, [language])


  const dispalyLamguage = (language: string) => {
    switch (language) {
      case "zh-tw":
        return "繁體中文";
        break;
      case "zh-cn":
        return "简体中文";
        break;
      case "ja":
        return "日本語";
        break;
      default:
        return "English";
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <div>
          <Languages className="w-6 h-6 rotate-0 scale-100 transition-all " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { setlanguage("en"); router.push('/en') }} className="cursor-pointer">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setlanguage("zh-tw"); router.push('/zh-tw') }} className="cursor-pointer">
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setlanguage("zh-cn"); router.push('/zh-cn') }} className="cursor-pointer">
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setlanguage("ja"); router.push('/ja') }} className="cursor-pointer">
          日本語
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageButton;
