// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from 'next/image'

import { table_text_size } from "@/Settings/settings"
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  var [measurement, setMeasurement] = React.useState<Measurement>({
    datetime: "",
    name: "",
    calf_grith: "",
    grip_strength: "",
    chair_standup5: "",
    muscle_quantity: "",
    gait_speed4: "",
    gait_speed6: "",
    balanceA: "",
    balanceB: "",
    balanceC: "",
    uid: "",
    rid: ""
  })
  const [measuring, setMeasuring] = React.useState(false);
  const [data_id, setData_id] = React.useState(-2);


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

    // did == null -> -2 => 沒有參數，代表不編輯資料
    // did == -1         => 代表編輯新資料
    // did > -1          => 代表編輯 index=did 的資料
    const index = did == null ? -2 : parseInt(did);
    if (index > -1) {
      console.log("in maesurement page 134:", index, data_measuring[index]);
      var measure_tmp = {
        datetime: "",
        name: "",
        calf_grith: "",
        grip_strength: "",
        chair_standup5: "",
        muscle_quantity: "",
        gait_speed4: "",
        gait_speed6: "",
        balanceA: "",
        balanceB: "",
        balanceC: "",
        uid: "",
        rid: ""
      };
      if (data_measuring[index]== undefined) return;
      measure_tmp.calf_grith = (data_measuring[index].calf_grith == undefined)? "" : data_measuring[index].calf_grith;
      measure_tmp.grip_strength = (data_measuring[index].grip_strength == undefined)? "" : data_measuring[index].grip_strength;
      measure_tmp.chair_standup5 = (data_measuring[index].chair_standup5 == undefined)? "" : data_measuring[index].chair_standup5;
      measure_tmp.muscle_quantity = (data_measuring[index].muscle_quantity == undefined)? "" : data_measuring[index].muscle_quantity;
      measure_tmp.gait_speed4 = (data_measuring[index].gait_speed4 == undefined)? "" : data_measuring[index].gait_speed4;
      measure_tmp.gait_speed6 = (data_measuring[index].gait_speed6 == undefined)? "" : data_measuring[index].gait_speed6;
      measure_tmp.balanceA = (data_measuring[index].balanceA == undefined)? "" : data_measuring[index].balanceA;
      measure_tmp.balanceB = (data_measuring[index].balanceB == undefined)? "" : data_measuring[index].balanceB;
      measure_tmp.balanceC = (data_measuring[index].balanceC == undefined)? "" : data_measuring[index].balanceC;

      setMeasurement(measure_tmp);
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

        { data_id > -2 && (
          <div className='container flex items-start mt-12 justify-center '>
          {true && (
            <Card className="w-[850px]">
              <CardHeader>
                <CardTitle>量測中資料</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">

                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-64 pt-3 " + table_text_size}>{t('name')}</Label>
                    <Label className={"ml-4 pt-1 "+ table_text_size} >{measurement.name}</Label>
                  </div>

                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="calf-grith">
                      {t('calf-grith')}({t('cm')})
                    </Label>
                    <Input className={table_text_size}
                      id="calf-grith"
                      value={measurement.calf_grith}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, calf_grith: e.target.value });
                      }}
                      placeholder={t('calf-grith')}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="grip_strength">
                      {t('grip-strength')}({t('kgs')})
                    </Label>
                    <Input className={table_text_size}
                      id="grip_strength"
                      value={measurement.grip_strength}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, grip_strength: e.target.value });
                      }}
                      placeholder={t('grip-strength')}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="chair_standupe">
                      {t("chair-standup")}({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="chair_standup"
                      value={measurement.chair_standup5}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, chair_standup5: e.target.value });
                      }}
                      placeholder={t("chair-standup")}
                    />
                  </div>                    
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="muscle_quantity">
                      {t("muscle-quantity")}({t("kgs")}/{t("cm")}<span className="text-sm align-top">2</span>)
                    </Label>
                    <Input className={table_text_size}
                      id="muscle_quantity"
                      value={measurement.muscle_quantity}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, muscle_quantity: e.target.value });
                      }}
                      placeholder={t("muscle-quantity")}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="gait_speed4">
                      {t("gait-speed")} : {t("4m")}({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="gait_speed4"
                      value={measurement.gait_speed4}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, gait_speed4: e.target.value });
                      }}
                      placeholder={t("gait-speed")}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"w-96 pt-3 " + table_text_size} htmlFor="gait_speed6">
                      {t("gait-speed")} : {t("6m")}({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="gait_speed6"
                      value={measurement.gait_speed6}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, gait_speed6: e.target.value });
                      }}
                      placeholder={t("gait-speed")}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"flex flex-row w-96 pt-3 " + table_text_size} htmlFor="ballanceA">
                      {t("balance")} <img src="/img/sppb_A.png" className="w-8 h-8"></img>({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="ballanceA"
                      value={measurement.balanceA}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, balanceA: e.target.value });
                      }}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"flex flex-row w-96 pt-3 " + table_text_size} htmlFor="ballanceB">
                      {t("balance")} <img src="/img/sppb_B.png" className="w-8 h-12"></img>({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="ballanceB"
                      value={measurement.balanceB}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, balanceB: e.target.value });
                      }}
                    />
                  </div>
                  <div className="flex flex-row space-y-1.5">
                    <Label className={"flex flex-row w-96 pt-3 " + table_text_size} htmlFor="ballanceC">
                      {t("balance")} <img src="/img/sppb_C.png" className="w-5 h-[54px] ml-1 -mt-3"></img>({t("seconds")})
                    </Label>
                    <Input className={table_text_size}
                      id="ballanceC"
                      value={measurement.balanceC}
                      onChange={(e) => {
                        setMeasurement({ ...measurement, balanceC: e.target.value });
                      }}
                    />
                  </div>


                </div>

              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" className={table_text_size}
                  onClick={async () => {
                    window.location.reload();
                  }}
                >
                  {t("clear-data")}
                </Button>

              </CardFooter>
            </Card>
          )
          }
          </div >
        )}
      </div >
    </>

  );
}