'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowDown, Check, X } from "lucide-react"

import { table_text_size } from "@/Settings/settings"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { jsPDF } from "jspdf"

export default function Index(props: any) {
  console.log("in guide", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  const [showPrimary, setShowPrimary] = React.useState(true);
  const [showHospital, setShowHospital] = React.useState(true);
  const [assessmentStandard, setAssessmentStandard] = React.useState("AWGS 2019");
  const [assessmentType, setAssessmentType] = React.useState(t("primary-care"));
  const [showStandard, setShowStandard] = React.useState(false);
  const [showType, setShowType] = React.useState(false);
  const [locale, setLocale] = React.useState(props.params.locale);

  useEffect(() => {
    //window.location.href = "/start"
    //router.push("/start");
  }, [])

  return (

    <div className="mt-12 flex flex-col w-full items-center justify-evenly ">

      <div className="flex flex-row w-full w-11/12 items-center justify-evenly">

        <div className="flex flex-col ">
          <Button className="w-[220px] font-bold text-2xl opacity-90" variant={"outline"}
            onClick={
              () => {
                setShowStandard(!showStandard);
                setShowType(false);
              }
            }
          >
            {assessmentStandard}
            <ArrowDown className="ml-2 h-6 w-6" />
          </Button>

          {showStandard && (
            <div className="w-full flex flex-row justify-start ">
              <ul
                className="absolute ml-4 py-2 px-8 bg-white
                                border border-gray-200 rounded-md  ">
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentStandard("AWGS 2019");
                      setShowStandard(false);
                    }
                  }
                >
                  AWGS 2019
                </li>
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentStandard("EWGSOP2");
                      setShowStandard(false);
                    }
                  }
                >
                  EWGSOP2
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <Button className="w-[300px] font-bold text-2xl opacity-90" variant={"outline"}
            onClick={
              () => {
                setShowStandard(false);
                setShowType(!showType);
              }
            }
          >
            {assessmentType}
            <ArrowDown className="ml-2 h-6 w-6" />
          </Button>

          {showType && (
            <div className="w-full flex flex-row justify-center ">
              <ul
                className="absolute py-2 px-8 bg-white 
                                border border-gray-200 rounded-md  ">
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentType(t("primary-care"));
                      setShowType(false);
                    }
                  }
                >
                  {t("primary-care")}
                </li>
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentType(t("hostpital-client"));
                      setShowType(false);
                    }
                  }
                >
                  {t("hostpital-client")}
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>

      <div className="flex flex-col h-full w-8/12 justify-evenly mt-4 rounded-2xl bg-white opacity-95">
        <div className="flex flex-row w-full items-center justify-center">

          {showPrimary && (assessmentStandard == "AWGS 2019") && (
            <div className="w-7/12 mt-4">
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[190px] text-xl bg-white rounded-2xl mt-3">
                    <div className="flex flex-col items-start justify-start p-4 ml-4">
                      <div className="">日期： 2023-10-02 </div>
                      <div className="mt-2">姓名： Alice</div>
                      <div className="mt-2">年齡： 23</div>
                      <div className="mt-2">性別： 女</div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">篩檢:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"小腿圍： 男<34公分，女<33公分"}</div>
                        <div className="bg-green-700 text-white p-1 rounded-md w-[100px]
                                        flex items-center justify-end pr-2">35.8 公分</div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-F 問卷 >= 4 分"}</div>
                        <div className="bg-red-700 text-white p-1 mt-1 rounded-md w-[100px]
                                        flex items-center justify-end pr-2"> 4 分 </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-CalF 問卷 >= 11 分"}</div>
                        <div className="bg-red-700 text-white p-1 mt-1 rounded-md w-[100px]
                                        flex items-center justify-end pr-2"> 11 分</div>
                      </div>
                    </div>
                  </div>
                  {/* <img src="/img/arrow-right-green.png" className="w-[100px] h-[50px] ml-2"></img>
                  <div className="w-[450px] h-[100px] p-4 rounded-2xl bg-green-700 text-white text-xl">
                    肌少症機率低。<div> 若有疑慮，請洽詢醫師 </div>
                  </div> */}
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
                <img src="/img/arrow-down-red.png" className="h-[50px] w-[50px] -ml-20"></img>
              </div>

              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl">
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">評估:</div>
                      <div className="text-xl font-bold ml-4">肌肉力量:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"握力: 男<28公斤，女<18公斤"}</div>
                        <div className="bg-green-700 text-white p-1 rounded-md w-[100px]
                                        flex items-center justify-end pr-2">35.8 公斤</div>
                      </div>
                      <div className="text-xl font-bold ml-4">體能表現:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"五次起立坐下: >=12 秒"}</div>
                        <div className="bg-green-700 text-white p-1 rounded-md w-[100px]
                                        flex items-center justify-end pr-2">11.28 秒</div>
                      </div>
                    </div>
                  </div>
                  {/* <img src="/img/arrow-right-green.png" className="w-[100px] h-[50px] ml-2"></img>
                  <div className="w-[450px] h-[100px] p-4 rounded-2xl bg-green-700 text-white text-xl">
                    肌少症機率低。<div> 若有疑慮，請洽詢醫師 </div>
                  </div> */}
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
                <img src="/img/arrow-down-red.png" className="h-[50px] w-[50px] -ml-20"></img>
              </div>

              <div className="flex flex-col w-full h-full mx-4 mb-8 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl">
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-bold mb-2">診斷:</div>

                        <Button className="bg-primary text-white text-xl -mt-4 w-[120px]">儲存診斷</Button>
                      </div>

                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14 text-2xl font-bold text-red-500">{"可能肌少症"}</div>
                        <div className=" text-white p-1 rounded-md w-[120px]"></div>
                      </div>
                      <div className="ml-16">
                        <div className="flex flex-row items-center justify-start">
                          1.
                          <div className="ml-2">請至醫院進行診斷確認</div></div>
                        <div>2. 請諮詢醫師進行『營養及運動生活型態調整』</div>
                      </div>

                      <div className="flex flex-row items-center justify-start mt-4">
                        <Label className="text-xl w-2/12" htmlFor="diagnostic">診斷者：</Label>
                        <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                          id="diagnostic" placeholder="名字"
                        />
                      </div>

                      <div className="mt-2">
                        說明:
                      </div>

                      <Textarea id="description" className="ml-[86px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400" />


                    </div>
                  </div>
                  {/* <img src="/img/arrow-right-blank.png" className="w-[100px] h-[50px] ml-2"></img> */}
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
              </div>

            </div>
          )}

        </div>



        {/* <div className="flex flex-row w-full items-center justify-center">

          {showHospital && (
            <div className="flex flex-col w-2/5 h-full mx-4 items-center justify-center">
              <div className="w-full h-[800px] border-2 flex flex-col items-center">
                <div className="mt-4 ml-4 p-4 border-2 border-black w-4/5 text-xl rounded-2xl">
                  <div className="text-2xl font-bold mb-2">{t('screening')}:</div>
                  <div className="ml-14">{"小腿圍： 男<34公分，女<33公分"}</div>
                  <div className="ml-8">{"或 SARC-F 問卷 >= 4 分"}</div>
                  <div className="ml-8">{"或 SARC-CalF 問卷 >= 11 分"}</div>
                </div>
              </div>
            </div>
          )}

        </div> */}

      </div>

    </div >

  );
}