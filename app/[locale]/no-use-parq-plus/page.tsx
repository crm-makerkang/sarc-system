// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { table_text_size } from "@/Settings/settings"
import React from 'react'
import { useEffect } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useTranslations } from "next-intl"

export default function ParqPlus(props: any) {
  console.log("parq-plus", props);
  const router = useRouter();
  const t = useTranslations('sarc');
  const [showAQ, setShowAQ] = React.useState(false);
  const [gq_answers, setGq_answers] = React.useState(
    [false, false, false, false, false, false, false]
  );
  const [aq_answers, setAq_answers] = React.useState(
    [false, false, false, false, false, false, false, false, false, false]
  );

  const checkGQanswers = () => {
    let needAQ = false;
    for (var i = 0; i < gq_answers.length; i++) {
      needAQ ||= gq_answers[i];
    }
    console.log(needAQ, gq_answers);
    setShowAQ(needAQ ? true : false);
  }

  return (

    <div className='container flex items-start justify-center'
      style={{
        backgroundImage: 'url(/img/bg-parq.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        height: '91vh', width: '100%'
      }}
    >
      <Card className="w-[1000px] mt-16">
        <CardHeader>
          <CardTitle>PARQ+</CardTitle>
          <CardContent>{t("parq-desc")}</CardContent>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Label className={table_text_size} htmlFor="name">{t("gq")}</Label>
            <hr></hr>
            <div className='flex flex-row'>
              <div className='mx-4 w-4'>{t("yes")}</div>
              <div className='mx-4 w-4'>{t("no")}</div>
            </div>
            <div >
              <ul  >
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq1' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[0] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq1' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[0] = false;
                        setGq_answers(setNew);
                        checkGQanswers();
                      }
                    }
                  />
                  <div className=''>{t("Q1")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq1")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq2' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[1] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq2' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[1] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <div className=''>{t("Q2")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq2")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq3' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[2] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq3' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[2] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <div className=''>{t("Q3")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq3")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq4' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[3] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq4' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[3] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <div className=''>{t("Q4")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq4")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq5' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[4] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq5' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[4] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    }
                  />
                  <div className=''>{t("Q5")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq5")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq6' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[5] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    } />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq6' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[5] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    } />
                  <div className=''>{t("Q6")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq6")}</div>
                </li>
                <li className={"flex flex-row " + table_text_size}>
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq7' value='Y'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[6] = true
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    } />
                  <input className='mt-2 mx-4 w-4 self-start' type='radio' name='gqq7' value='N'
                    onClick={
                      () => {
                        let setNew = gq_answers;
                        //console.log(gq_answers);
                        setNew[6] = false
                        setGq_answers(setNew);
                        checkGQanswers()
                      }
                    } />
                  <div className=''>{t("Q7")}</div>
                  <div className='w-[760px] mb-4'>{t("gqq7")}</div>
                </li>
              </ul>
              <hr></hr>
            </div>
          </div>
        </CardContent>
        <CardContent>
          {showAQ && (
            <div className="grid w-full items-center gap-4">
              <div className='text-red-500 font-bold'>{t("need-aq-msg")}</div>
              <Label className={table_text_size} htmlFor="name">{t("aq")}</Label>
              <hr></hr>
              <div className='flex flex-row'>
                <div className='mx-4 w-4'>{t("yes")}</div>
                <div className='mx-4 w-4'>{t("no")}</div>
              </div>
              <div >
                <ul  >
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq1' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[0] = true
                          setAq_answers(setNew);
                          //checkGQanswers()
                        }
                      }
                    />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq1' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[0] = false;
                          setAq_answers(setNew);
                          //checkGQanswers();
                        }
                      }
                    />
                    <div className=''>{t("Q1")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq1")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq2' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[1] = true
                          setAq_answers(setNew);
                          //checkGQanswers()
                        }
                      }
                    />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq2' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[1] = false
                          setAq_answers(setNew);
                          //checkGQanswers()
                        }
                      }
                    />
                    <div className=''>{t("Q2")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq2")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq3' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[2] = true
                          setAq_answers(setNew);
                          //checkGQanswers()
                        }
                      }
                    />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq3' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[2] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      }
                    />
                    <div className=''>{t("Q3")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq3")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq4' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[3] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      }
                    />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq4' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[3] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      }
                    />
                    <div className=''>{t("Q4")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq4")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq5' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[4] = true
                          setAq_answers(setNew);
                          checkGQanswers()
                        }
                      }
                    />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq5' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.log(gq_answers);
                          setNew[4] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      }
                    />
                    <div className=''>{t("Q5")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq5")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq6' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[5] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq6' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[5] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <div className=''>{t("Q6")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq6")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq7' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[6] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq7' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[6] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <div className=''>{t("Q7")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq7")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq8' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[7] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq8' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[7] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <div className=''>{t("Q8")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq8")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq9' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[8] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq9' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[8] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <div className=''>{t("Q7")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq9")}</div>
                  </li>
                  <li className={"flex flex-row " + table_text_size}>
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq10' value='Y'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[9] = true
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <input className='mt-2 mx-4 w-4 self-start' type='radio' name='aqq10' value='N'
                      onClick={
                        () => {
                          let setNew = aq_answers;
                          //console.logaq_answers);
                          setNew[9] = false
                          setAq_answers(setNew);
                          // checkGQanswers()
                        }
                      } />
                    <div className=''>{t("Q10")}</div>
                    <div className='w-[760px] mb-4'>{t("aqq10")}</div>
                  </li>
                </ul>
                <hr></hr>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" className={table_text_size}
            onClick={async () => {
              router.push("/start");
            }}
          >
            Cancel and Back
          </Button>
          <Button className={'bg-primary  ' + table_text_size}
            onClick={
              async () => {
                router.push("/start/?id=12345&GQ=" + "NNNNNNN" + "&AQ=" + "NNNNNNNNNN");
                // window.location.href = '/start'; 
              }
            }
          >
            NEXT
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}