// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { useTranslations } from "next-intl"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { UserInfo, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<UserInfo[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "2",
      amount: 200,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "3",
      amount: 300,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "4",
      amount: 400,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "5",
      amount: 550,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "6",
      amount: 600,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "7",
      amount: 700,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "8",
      amount: 825,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "9",
      amount: 900,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "10",
      amount: 1025,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "11",
      amount: 1100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "12",
      amount: 1225,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "13",
      amount: 1300,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "14",
      amount: 1425,
      status: "processing",
      email: "example@gmail.com",
    },
  ]
}

export default async function Home() {

  // Next_intl
  //const t = useTranslations('sarc'); // 會造成 Warning: Hooks are not supported inside an async component. 
  // 但程式執行正常
  const data = await getData();

  // columns[1].header = t("Status");
  // // columns[2].header = t("Email");

  // columns[2].header =
  //   <Button variant="ghost" >
  //     <div className='text-xl'>{t("Email")}</div>
  //     <ArrowUpDown className="ml-2 h-6 w-6" />
  //   </Button>


  // columns[3].header = t("Amount");

  return (
    // <Container> use my Container in components/Container.tsx
    <div className="container mx-auto"> {/*Tailwind's container class */}
      {/* <div className='text-xl'> {t("users")}</div> */}
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div >

    // </Container>
  );
}