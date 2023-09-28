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

import { columns_measurements } from "./columns-measurements"
import { columns_measuring } from "./columns-measuring"

import { UserInfo, Measurement } from "@/types/types"
import { DataTableMeasurements } from "./data-table-measurements"
import { DataTableMeasuring } from "./data-table-measuring"
import { useEffect } from "react";

export default function Home(props: any) {

  const t = useTranslations('sarc');

  const searchParams = useSearchParams();

  const [userData, setUserData] = React.useState<UserInfo[]>([]);

  var [data, setData] = React.useState<UserInfo[]>([]) // TODO: change the data type and naming

  var [data_measuring, setData_measuring] = React.useState<Measurement[]>([])
  var [data_records, setData_records] = React.useState<Measurement[]>([])
  const [measuring, setMeasuring] = React.useState(false);
  const [data_id, setData_id] = React.useState(0);


  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    //console.log(res.data);
    setUserData(res.data);
  }

  const getMeasuring = async () => {
    const res = await axios.get('/api/measurements?type=measuring')
    console.log("in measurement page 45: getMeasuring:", res.data, userData);

    if (res.data.length == 0) {
      setData_measuring([]);
    }
    for (var i = 0; i < res.data.length; i++) {
      //res.data[i].name = "looking-for-user";
      for (var j = 0; j < userData.length; j++) {
        if (res.data[i].uid == userData[j].id) {
          res.data[i].name = userData[j].name;
          break;
        }
      }
    }
    setData_measuring(res.data);
  }

  const getMeasurements = async () => {
    const res = await axios.get('/api/measurements?type=records')
    console.log("in measurement page 51: getMeasurements:", res.data.length);
    for (var i = 0; i < res.data.length; i++) {
      //res.data[i].name = "looking-for-user";
      for (var j = 0; j < userData.length; j++) {
        if (res.data[i].uid == userData[j].id) {
          res.data[i].name = userData[j].name;
          break;
        }
      }
    }
    setData_records(res.data);
  }

  useEffect(() => {
    getUsers();
    // getMeasuring();
    // getMeasurements();
    const isMeasuring = searchParams.get('type') == 'measuring';

    if (isMeasuring) {
      setMeasuring(true);
    }
  }, [])

  useEffect(() => {
    console.log("in measurement page 63:", userData);
    getMeasuring();
    getMeasurements();
  }, [userData])

  useEffect(() => {
    const did = searchParams.get('did');
    console.log("in measurement page 95:", did);

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
          <Button className={"mt-4 mx-4 text-xl " + (measuring ? "bg-primary" : "bg-gray-200 text-gray-400")}
            onClick={
              () => {
                // setMeasuring(true);
                window.location.href = "/measurements?type=measuring";
              }
            }
          >
            {t("measuring")}
          </Button>

          <Button className={"mt-4 mx-4 text-xl " + (measuring ? "bg-gray-200 text-gray-400" : "bg-primary")}
            onClick={
              () => {
                // setMeasuring(false);
                window.location.href = "/measurements/";
              }
            }
          >
            {t("user-records")}
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
            <DataTableMeasurements columns={columns_measurements} data={data_records} getData={getMeasurements} />
          </div>

        )}
      </div >
    </>

  );
}