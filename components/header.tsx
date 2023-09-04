'use client'

import { Butterfly_Kids } from "next/font/google"
import Container from "@/components/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Sun, Moon, Menu } from "lucide-react"
import ProfileButton from "@/components/profilebutton"
import { useTheme } from "next-themes"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

// Navigation routes
const routes = [
  {
    href: "/1",
    label: "Products",
  },
  {
    href: "/2",
    label: "Categories",
  },
  {
    href: "/3",
    label: "On Sale",
  },
]

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="sm:flex sm:justify-between py3 px-4 border-b">
      <Container>


        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 
                        items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" className="ml-4 lg:ml-0">
              <div className="flex flex-row items-center">
                <Avatar>
                  <AvatarImage src="/img/shadcn.jpg" />
                  <AvatarFallback>SARC</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  SARCOPENIA ASSESSMENT
                </div>
              </div>
            </Link>
          </div>

          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
            {routes.map((route, i) => (
              <Button asChild variant={"ghost"}>
                <Link key={i} href={route.href} className="text-sm font-medium transition-colors">
                  {route.label}

                </Link>
              </Button>
            ))

            }
          </nav>

          <div className="flex items-center">
            <ProfileButton />

          </div>

        </div>
      </Container>
    </div>
  )
}
