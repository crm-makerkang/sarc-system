'use client'

import { useState, useEffect } from "react"

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

  const dispalyLamguage = (language: any) => {
    switch (language) {
      case "zh":
        return "中文";
        break;
      case "ja":
        return "日文";
        break;
      default:
        return "English";
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {dispalyLamguage(language)}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>Languages</DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setlanguage("en")} className="cursor-pointer">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setlanguage("ja")} className="cursor-pointer">
          日文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setlanguage("zh")} className="cursor-pointer">
          中文
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageButton;
