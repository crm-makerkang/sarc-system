// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { useTranslations } from "next-intl"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { columns } from "./columns"
import { columns_measuring } from "./columns-measuring"

import { UserInfo, InMeasuring } from "@/types/types"
import { DataTable } from "./data-table"
import { DataTableMeasuring } from "./data-table-measuring"
import { useEffect } from "react";

export default function Home(props: any) {

  const searchParams = useSearchParams();

  var [data, setData] = React.useState<UserInfo[]>([])
  var [data_measuring, setData_measuring] = React.useState<InMeasuring[]>([])
  const [measuring, setMeasuring] = React.useState(true);
  const [data_id, setData_id] = React.useState(0);

  //let data1 = getData();

  const getMeasuring = async () => {
    const res = await axios.get('/api/measurements?type=measuring')
    console.log("in measurement page 36: getMeasuring:", res.data.length);
    setData_measuring(res.data);
  }

  const getMeasurements = async () => {
    const res = await axios.get('/api/measurements?type=records')
    console.log("in measurement page 43: getMeasurements:", res.data.length);
    setData(res.data);
  }

  useEffect(() => {
    getMeasuring();
    getMeasurements();

  }, [])

  useEffect(() => {
    const did = searchParams.get('did');
    console.log("in measurement page 53:", did);

    // did == null => 沒有參數，代表不編輯資料
    // did == -1   => 代表編輯新資料
    // did > -1    => 代表編輯 index=did 的資料
    const index = did == null ? -2 : parseInt(did);
    if (index > -1) {
      console.log("in maesurement page 55:", index, data_measuring[index]);
    }
    setData_id(index);

  }, [data_measuring])


  return (
    <>
      {data_id < -1 && (
        <div className="flex items-center justify-center mt-6">
          <Button className={"mx-4 text-xl " + (measuring ? "bg-primary" : "bg-gray-200 text-gray-400")}
            onClick={
              () => {
                setMeasuring(true);
              }
            }
          >
            量測中
          </Button>

          <Button className={"mx-4 text-xl " + (measuring ? "bg-gray-200 text-gray-400" : "bg-primary")}
            onClick={
              () => {
                setMeasuring(false);
              }
            }
          >
            量測紀錄
          </Button>
        </div>
      )}

      <div className="container mx-auto"> {/*Tailwind's container class */}
        {measuring && data_id < -1 && (
          <div className="mt-8 p-12 rounded-xl bg-white opacity-95">
            <DataTableMeasuring columns={columns_measuring} data={data_measuring} getData={getMeasuring} />
          </div>
        )}

        {!measuring && data_id < -1 && (
          <div className="mt-8 p-12 rounded-xl bg-white opacity-95">
            <DataTable columns={columns} data={data} getData={getMeasurements} />
          </div>

        )}
      </div >
    </>

  );
}