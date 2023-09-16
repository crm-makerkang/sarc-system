'use client';

// PARQ 參考 https://github.com/parqform/webform/blob/main/index.html

import { useRouter } from "next/navigation";
import { UserInfo } from "@/types/types"
import { useTranslations } from 'next-intl';
import { table_text_size } from "@/Settings/settings"
import { Checkbox } from '@/components/ui/checkbox';
import * as React from "react"
import { useEffect } from "react";

import axios from "axios";

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

export default function Index(props: any) {
  console.log("start", props);
  const router = useRouter();
  const t = useTranslations('sarc');
  const [user, setUser] = React.useState<UserInfo>({
    id: "",
    name: "",
    card_id: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    parq: false
  })
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const [showSearch, setShowSearch] = React.useState(false);
  const [showDataCard, setShowDataCard] = React.useState(true);
  const [showBinding, setshowBinding] = React.useState(false);
  const [showPARQ, setShowPARQ] = React.useState(false);
  const [showAQ, setShowAQ] = React.useState(false);

  const [matchedList, setMatchedList] = React.useState([]);
  const [userData, setUserData] = React.useState<UserInfo[]>([])


  const [gq_answers, setGq_answers] = React.useState(
    [false, false, false, false, false, false, false]
  );
  const [aq_answers, setAq_answers] = React.useState(
    [false, false, false, false, false, false, false, false, false, false]
  );

  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    //console.log(res.data);
    setUserData(res.data);
    //simulate no data setData([]);
  }

  const checkGQanswers = () => {
    let needAQ = false;
    for (var i = 0; i < gq_answers.length; i++) {
      needAQ ||= gq_answers[i];
    }
    console.log(needAQ, gq_answers);
    setShowAQ(needAQ ? true : false);
  }

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <>
    <div className='container flex items-center justify-center ' style={{
      backgroundImage: 'url(/img/bg-start.png)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      height: '91vh', width: '100%'
    }}>
      {showDataCard && (
        <Card className="w-[550px]">
          <CardHeader>
            <CardTitle>{t('user-data')} <span className="text-red-500 text-lg">{t('required-msg')}</span></CardTitle>
          </CardHeader>
          <CardContent>
            {/* <form> */}
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="name">{t('name')}*</Label>
                <Input className={table_text_size}
                  id="name"
                  value={user.name}
                  onChange={
                    (e) => {
                      setUser({ ...user, name: e.target.value });
                      setShowSearch(true);
                      let matched = 0;
                      let toMatchedList: any = [];
                      userData.map((user, index) => {
                        if ((matched < 5) && (user.name.includes(e.target.value))) {
                          //console.log(item.name);
                          toMatchedList[matched] = (user.name);
                          setMatchedList(toMatchedList)
                          matched++;
                        }
                      })
                    }
                  }
                  placeholder={t('your-name')}
                />
              </div>

              {showSearch && matchedList.length > 0 && (
                <div className="">
                  <ul
                    className="absolute w-[360px] ml-32 -mt-4 py-2 px-8 bg-gray-200 
                          border border-gray-200 rounded-md  ">
                    {matchedList.map((item, index) => {
                      return <li key={index}
                        className={"py-2 cursor-pointer " + table_text_size}
                        onClick={
                          () => {

                            for (let i = 0; i < userData.length; i++) {
                              if (userData[i].name === item) {
                                console.log(userData[i]);
                                setUser(userData[i]);
                              }
                            }

                            //setUser({ ...user, name: item });
                            setShowSearch(false);
                          }
                        }
                      >
                        {item}
                      </li>
                    })}
                  </ul>
                </div>
              )}

              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="phone">{t('phone')}</Label>
                <Input className={table_text_size}
                  id="phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  placeholder={t('phone')}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="email">{t('email')}</Label>
                <Input className={table_text_size}
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder={t('email')}
                />
              </div>
            </div>

            <hr className='m-4'></hr>
            <div className="mb-2 text-lg text-red-500 font-bold ">{t('bio-msg')}</div>

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="gender">{t('bio-gender')}*</Label>
                <Select
                  value={t(user.gender)}
                  onValueChange={(value) => console.log(value)}
                >
                  <SelectTrigger className={"text-gray-500 " + table_text_size}>
                    <SelectValue placeholder={t("s-bio-gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className={"text-gray-500 " + table_text_size} value={t("male")}>{t("male")}</SelectItem>
                      <SelectItem className={"text-gray-500 " + table_text_size} value={t("female")}>{t("female")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="age">{t("age")}*</Label>
                <Input className={table_text_size}
                  id="age"
                  value={user.age}
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                  placeholder={t("age")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="height">{t("height")}*</Label>
                <Input className={table_text_size}
                  id="height"
                  value={user.height}
                  onChange={(e) => setUser({ ...user, height: e.target.value })}
                  placeholder={t("height")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="weight">{t("weight")}*</Label>
                <Input className={table_text_size}
                  id="weight"
                  value={user.weight}
                  onChange={(e) => setUser({ ...user, weight: e.target.value })}
                  placeholder={t("weight")}
                />
              </div>
            </div>

            <hr className='m-4'></hr>

            <div className="flex justify-between space-x-2">
              <div className="mt-2">
                <Checkbox className=" w-4 h-4" id="parq_checkbox" checked={user.parq} />
                <Label className={" ml-2   " + table_text_size} htmlFor="parq_checkbox">PARQ+</Label>
                { showAQ && (
                  <span className={" ml-2 " + table_text_size}> Need Attention</span>
                  )
                }
              </div>

              <Button className={'bg-primary justify-end ' + table_text_size}
                onClick={async () => {
                  setShowPARQ(true);
                  setShowDataCard(false);
                  //router.push("/parq-plus/?id=8afdf75e-5f4d-4dca-82bc-301cc2707961&name=paul kang");
                }}
              >
                {t("take-parq")}
              </Button>
            </div>

            {/* <hr className='m-4'></hr>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="card_id">ID {t("card-no")}</Label>
                <Input className={table_text_size}
                  id="card_id"
                  value={user.card_id}
                  onChange={(e) => setUser({ ...user, card_id: e.target.value })}
                  placeholder={t("card-msg")}
                />
              </div>
            </div> */}

            {/* </form> */}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" className={table_text_size}
              onClick={async () => {
                window.location.reload();
              }}
            >
              清除資料
            </Button>
            <Button className={'bg-primary  ' + table_text_size}
              onClick={async () => {
                //alert("如果進行量測，您的個人資料和量測結果會被存入本機資料庫，但不會上傳到雲端。若有需要，您可以要求本機管理員刪除您的個人資料和量測結果");
                setShowDataCard(false);
                setshowBinding(true);
              }}
            >
              進行量測
            </Button>
          </CardFooter>
        </Card>
        )
      }

      {showBinding && (
        <Card className="w-[550px]">
          <CardHeader>
            <CardTitle>用戶：{user.name} 您好，請綁定卡號後進行量測</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="card_id">ID {t("card-no")}</Label>
                <Input autoFocus className={table_text_size}
                  id="card_id"
                  value={user.card_id}
                  onChange={
                    (e) => {
                      let card_id: string = "";
                      console.log(e.target.value);
                      if (e.target.value.length == 10) {
                        console.log("10 digits detected");

                        card_id = e.target.value;
                        e.target.value = ""
                      }
                      setUser({ ...user, card_id: e.target.value });

                    }
                  }
                  placeholder={t("card-msg")}
                />
              </div>
              {user.card_id != "" && (
                <div className={table_text_size}>已綁定卡號： {user.card_id}</div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" className={'flex ' + table_text_size}
              onClick={async () => {
                //setParq_checked(!parq_checked);
                setShowDataCard(true);
                setshowBinding(false);
                setUser({ ...user, card_id: "" });
              }}
            >
              {t("cancel")}
            </Button>
            {user.card_id != "" && (
              <Button className={'flex bg-primary  ' + table_text_size}
                onClick={async () => {
                  //setParq_checked(!parq_checked);
                  //setShowDataCard(false);
                }}
              >
                綁定後開始量測
              </Button>
            )}
          </CardFooter>
        </Card>         
        )
      }

      {showPARQ && (
        <div className=' absolute top-16 left-1/2 -translate-x-[500px] flex items-start justify-center '>
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
                  setShowPARQ(false);
                  setShowDataCard(true);
                }}
              >
                Cancel and Back
              </Button>
              <Button className={'bg-primary  ' + table_text_size}
                onClick={
                  async () => {
                    //router.push("/start/?id=12345&GQ=" + "NNNNNNN" + "&AQ=" + "NNNNNNNNNN");
                    // window.location.href = '/start'; 

                  }
                }
              >
                NEXT
              </Button>
            </CardFooter>
          </Card>
        </div>
        )
      }
    </div>

    
    {/* <div className='container flex items-start justify-center '>
      {showPARQ && (
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
                setShowPARQ(false);
                setShowDataCard(true);
              }}
            >
              Cancel and Back
            </Button>
            <Button className={'bg-primary  ' + table_text_size}
              onClick={
                async () => {
                  //router.push("/start/?id=12345&GQ=" + "NNNNNNN" + "&AQ=" + "NNNNNNNNNN");
                  // window.location.href = '/start'; 

                }
              }
            >
              NEXT
            </Button>
          </CardFooter>
        </Card>
        )
      }
    </div> */}

    </>
  );
}