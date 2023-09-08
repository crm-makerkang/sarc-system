// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'

import React from "react";
import axios from "axios";
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { useTranslations } from "next-intl"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"


import { columns } from "./columns"

import { UserInfo } from "@/types/types"
import { DataTable } from "./data-table"
import { useEffect } from "react";

// async function getData(): Promise<UserInfo[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       uuid: "d881f741-3b70-4ec1-b9e1-0ef418254298",
//       name: "Paul Kang",
//       email: "paul.k@example.com",
//       phone: "12345678",
//       age: "57",
//       gender: "男",
//       remark: "VIP"
//     },
//     {
//       uuid: "d881f741-3b70-4ec1-b9e1-0ef418254298",
//       name: "Tony Lu",
//       email: "tony.l@example.com",
//       phone: "22222222",
//       age: "22",
//       gender: "男",
//       remark: "VIP"
//     },
//     {
//       uuid: "d881f741-3b70-4ec1-b9e1-0ef418254298",
//       name: "Sarah Lin",
//       email: "sarah.l@example.com",
//       phone: "33333333",
//       age: "18",
//       gender: "女",
//       remark: "VVIP"
//     },
//   ]
// }

export default function Home() {

  var [data, setData] = React.useState<UserInfo[]>([])

  //let data1 = getData();

  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    console.log(res.data);
    setData(res.data);
    //simulate no data setData([]);
  }

  useEffect(() => {
    getUsers();

    // 定時更新資料
    // const interval = setInterval(() => {
    //   getUsers()
    // }, 3000)

  }, [])

  console.log("page",process.env.DOMAIN);

  return (
    // <Container> use my Container in components/Container.tsx
    <div className="container mx-auto"> {/*Tailwind's container class */}
      {/* <div className='text-xl'> {t("users")}</div> */}
      <div>
        <DataTable columns={columns} data={data} getUsers={getUsers} />
      </div>
    </div >

    // </Container>
  );
}