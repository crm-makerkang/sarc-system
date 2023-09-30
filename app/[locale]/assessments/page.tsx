'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowDown } from "lucide-react"

import { table_text_size } from "@/Settings/settings"

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
  const [showHospital, setShowHospital] = React.useState(false );
  const [assessmentStandard, setAssessmentStandard] = React.useState("AWGS 2019");
  const [assessmentType, setAssessmentType] = React.useState(t("primary-care"));
  const [showStandard, setShowStandard] = React.useState(false);
  const [showType, setShowType] = React.useState(false);

  useEffect(() => {
    //window.location.href = "/start"
    //router.push("/start");
  }, [])

  return (

    <div className="mt-12 flex flex-col w-full items-center justify-evenly ">

      {/* <div className="w-11/12 flex flex-row justify-start ">

        <Button className="font-bold text-xl bg-gray-200 w-[200px]" variant={"outline"}
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

        <Button className="ml-4 font-bold text-xl bg-gray-200 w-[250px]" variant={"outline"}
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

      </div>

      { showStandard && (
        <div className="w-11/12 flex flex-row justify-start ">
          <ul
            className="absolute w-[200px] ml-2 py-2 px-8 bg-gray-500 
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

      { showType && (
        <div className="w-11/12 flex flex-row justify-start ">
          <ul
            className="absolute w-[250px] ml-56 py-2 px-8 bg-gray-500 
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
      )} */}


      <div className="flex flex-row h-full w-11/12 justify-evenly mt-4 rounded-2xl bg-gray-200">

        <div className="h-full  w-11/12 ">
            <div className="flex flex-row w-full items-center justify-between">

            <div className="h-[800px] w-[20px] flex flex-col justify-around text-4xl ">
              <div>篩檢</div>
              <div>評估</div>
              <div>診斷</div>
            </div>

            {showPrimary && (
              <div className="flex flex-col w-2/3 h-full mx-4 items-center justify-center">
                <Button className="w-full font-bold text-2xl bg-gray-200 " variant={"outline"}
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

                { showType && (
                <div className="w-full flex flex-row justify-center ">
                  <ul
                    className="absolute py-2 px-8 bg-gray-500 
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

                <div className="w-full h-[800px] border-2 border-black flex flex-col items-center justify-top">

                <div className="w-full flex flex-row justify-between ">

                  <Button className="w-1/4 font-bold text-xl bg-gray-200 w-[200px]" variant={"outline"}
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


                </div>

                { showStandard && (
                <div className="w-full flex flex-row justify-start ">
                  <ul
                    className="absolute ml-4 py-2 px-8 bg-gray-500 
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
                 
                  <div className="mt-4 ml-4 p-4 border-2 border-black w-4/5 text-xl">
                    <div>{"小腿圍： 男<34公分，女<33公分"}</div>
                    <div>{"或 SARC-F 問卷 >= 4 分"}</div>
                    <div>{"或 SARC-CalF 問卷 >= 11 分"}</div>
                  </div>
                </div>
              </div>
            )}

            {showHospital && (
              <div className="flex flex-col w-3/5 h-full mx-4 items-center justify-center">
                <div className="mt-2 text-2xl">急慢性照護或臨床研究</div>

                <div className="w-full h-[800px] border-2 border-black ">
                  DDD
                </div>
              </div>
            )}

            <div className="flex flex-col w-1/3 h-full mx-4 items-center justify-center">
              <div className="w-full h-[800px] border-2 border-black flex flex-col items-center justify-top">
                <div className="mt-4 ml-4 p-4 border-2 border-black w-4/5 text-xl">
                  <div>{"小腿圍： 男<34公分，女<33公分"}</div>
                  <div>{"或 SARC-F 問卷 >= 4 分"}</div>
                  <div>{"或 SARC-CalF 問卷 >= 11 分"}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* <Card className="w-11/12 h-[800px]">
          <CardHeader>
            <CardTitle>{t('guide-1-title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <hr></hr>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <div className={"mt-4 " + table_text_size} >
                  {t('guide-1-msg')}
                </div>
              </div>
              <img src="/img/ibox-beep.jpg" className="rounded-2xl mt-12"></img>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
          </CardFooter>
        </Card> */}

      </div>

    </div>

  );
}