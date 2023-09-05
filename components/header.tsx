"use client"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import LanguageButton from "@/components/LanguageButton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"
import { get_nav_routes } from "@/Settings/setting"

export default function Header(test: any) {
  console.log(test)

  const t = useTranslations('sarc');

  const nav_routes = get_nav_routes();

  return (
    <div className="sm:flex sm:justify-between py3 px-4 border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 
                        items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" className="ml-4 lg:ml-0">
              <div className="flex flex-row items-center">
                <Avatar>
                  <AvatarImage src="/img/s-logo.png" />
                  <AvatarFallback>SARC</AvatarFallback>
                </Avatar>
                <div className="ml-2 text-primary text-2xl font-bold">
                  SarcopeniaCHECK
                </div>
              </div>
            </Link>
          </div>

          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
            {nav_routes.map((route, i) => (
              <Button asChild variant={"ghost"}  >
                <Link key={route.href} href={route.href} id={route.href}
                  className="text-xl font-medium transition-colors text-primary"
                >
                  {t(route.href.substring(1))}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center">
            <LanguageButton />

          </div>

        </div>
      </Container>
    </div>
  )
}
