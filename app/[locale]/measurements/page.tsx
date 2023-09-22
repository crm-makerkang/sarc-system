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

import { Measuements } from "@/types/types"
import { DataTable } from "./data-table"
import { useEffect } from "react";

export default function Home() {

  var [data, setData] = React.useState<Measuements[]>([])

  //let data1 = getData();

  const getMeasuements = async () => {
    const res = await axios.get('/api/users/')
    console.log(res.data);
    setData(res.data);
    //simulate no data setData([]);
  }

  useEffect(() => {
    getMeasuements();
  }, [])

  console.log("page", process.env.DOMAIN);

  return (
    // <Container> use my Container in components/Container.tsx
    <div className="container mx-auto"> {/*Tailwind's container class */}
      <div className="mt-16 p-12 rounded-xl bg-white opacity-95">
        <DataTable columns={columns} data={data} getData={getMeasuements} />
      </div>
    </div >

    // </Container>
  );
}