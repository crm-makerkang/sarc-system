"use client"

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import React, { useEffect } from "react"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import SettingButton from "@/components/SettingButton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"
import { nav_routes } from "@/models/nav_routes";

import axios from "axios"

export default function Header(test: any) {
  //console.log("in Header", test)

  // const res = await axios.get('/api/token/');

  const [tab, setTab] = React.useState("");
  const [privilege, setPrivilege] = React.useState(false);
  const [username, setUsername] = React.useState("");


  useEffect(() => {
    console.log("in Hedaer 28:");
    const get_privilege = async () => {
      const res = await axios.get('/api/token/')
      //console.log("in Hedaer 31:", res.data, typeof res.data);
      setUsername(res.data.username);
      setPrivilege((res.data.privilege == 100) ? true : false);
    }

    get_privilege();
    const pathArray = window.location.href.split("/")
    setTab("/" + pathArray[pathArray.length - 1]);

  }, [])

  const t = useTranslations('sarc');

  const baseStyle = "text-xl font-medium transition-colors text-primary font-bold "
  const underlineStyle = " underline underline-offset-4"

  return (
    <div className="sm:flex sm:justify-between py3 px-4 border-b ">
      {/* <Container> */}
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 
                        items-center justify-between w-full">
        <div className="flex items-center">
          <div className="ml-4 lg:ml-0">
            <div className="flex flex-row items-center">
              {/* <Avatar>
                  <AvatarImage src="/img/s-logo.png" />
                  <AvatarFallback>SARC</AvatarFallback>
                </Avatar> */}
              <Image className="rounded-full" src="/img/ucm-logo.png" width={100} height={40} alt=""></Image>
              {/* <Image className="rounded-full" src="/img/s-logo.png" width={30} height={30} alt=""></Image> */}
              <div className="ml-2 text-primary text-2xl font-bold">
                SarcCHECK
              </div>
            </div>
          </div>
        </div>

        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6  md:block">
          {nav_routes.map((route, i) => (
            <Button variant={"ghost"} key={i} onClick={() => { window.location.href = route.href }}
              className={baseStyle + (tab == route.href ? underlineStyle : "")}
            >

              {t(route.href.substring(1))}

            </Button>

          ))}

          <Button variant={"ghost"}
            onClick={() => {
              if (privilege == true) {
                window.location.href = "/management"
              } else {
                alert(t("no-privilege"))
              }
            }}
            className={baseStyle + (tab == "/management" ? underlineStyle : "")}
          >
            {t("management")}
          </Button>

        </nav>

        <div className='flex flex-row text-xl'>
          <div className='mr-4 '>
            {username}
          </div>

          <div className="flex items-center">
            <SettingButton />

          </div>
        </div>

      </div>
      {/* </Container> */}
    </div>
  )
}
