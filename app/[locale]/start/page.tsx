'use client';

// PARQ 參考 https://github.com/parqform/webform/blob/main/index.html

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

  //console.log("xxx", props);

  const t = useTranslations('sarc');
  const [user, setUser] = React.useState({
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
  const [showParqCard, setshowParqCard] = React.useState(false);
  //const [parq_checked, setParq_checked] = React.useState(false);

  const [matchedList, setMatchedList] = React.useState([]);

  var [userData, setUserData] = React.useState<UserInfo[]>([])

  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    //console.log(res.data);
    setUserData(res.data);
    //simulate no data setData([]);
  }

  useEffect(() => {
    getUsers();
  }, [])

  // useEffect(() => {
  //   if (user.name.length > 4) {
  //     userData.forEach(element => {
  //       if (element.name.includes(user.name)) {
  //         console.log(element.name);
  //       }
  //     });
  //   }
  // }, [user])

  return (
    <div className='container flex items-center justify-center ' style={{
      backgroundImage: 'url(/img/bg-md.png)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      height: '91vh', width: '100%'
    }}>
      {showDataCard && (
        <Card className="w-[550px]">
          <CardHeader>
            <CardTitle>{t('user-data')}</CardTitle>
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
                {showSearch && matchedList.length > 0 && (
                  <ul
                    className="absolute w-[380px] top-[350px] left-1/2 -translate-x-28 py-2 px-2 bg-white 
                            border border-gray-200 rounded-md ">
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
                )}
              </div>
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
            <div className={"mb-2 " + table_text_size}>{t('bio-msg')}</div>

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="gender">{t('bio-gender')}</Label>
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
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="age">{t("age")}</Label>
                <Input className={table_text_size}
                  id="age"
                  value={user.age}
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                  placeholder={t("age")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="height">{t("height")}</Label>
                <Input className={table_text_size}
                  id="height"
                  value={user.height}
                  onChange={(e) => setUser({ ...user, height: e.target.value })}
                  placeholder={t("height")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="weight">{t("weight")}</Label>
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
              <Checkbox className="mt-2 w-6 h-6" id="parq_checkbox" checked={user.parq} />
              <Label className={"w-44 mt-2 " + table_text_size} htmlFor="parq_checkbox">PARQ+</Label>

              <Button className={'bg-primary justify-end ' + table_text_size}
                onClick={async () => {
                  //setParq_checked(!parq_checked);
                  //setShowDataCard(false);
                  setshowParqCard(true);
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
                  placeholder={t("rfid-msg")}
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
                alert("如果進行量測，您的個人資料和量測結果會被存入本機資料庫，但不會上傳到雲端。若有需要，您可以要求本機管理員刪除您的個人資料和量測結果");
                setShowDataCard(false);
                setshowBinding(true);
                setshowParqCard(false);
              }}
            >
              進行量測
            </Button>
          </CardFooter>
        </Card>
      )
      }

      {
        showBinding && (
          <Card className="w-[550px]">
            <CardHeader>
              <CardTitle>用戶：{user.name} 你好，請綁定卡號後進行量測</CardTitle>
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
                        let rfid: string = "";
                        console.log(e.target.value);
                        if (e.target.value.length == 10) {
                          console.log("10 digits detected");

                          rfid = e.target.value;
                          e.target.value = ""
                        }
                        setUser({ ...user, card_id: e.target.value });
                      }
                    }
                    placeholder={t("rfid-msg")}
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
                  setshowParqCard(false);
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
                    setshowParqCard(true);
                  }}
                >
                  綁定後開始量測
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      }

      {
        showParqCard && (
          <Card className="w-[550px]">
            <CardHeader>
              <CardTitle>PARQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-row space-y-1.5">
                  <Label className={"w-44 pt-3 " + table_text_size} htmlFor="card_id">ID {t("card-no")}</Label>
                  <Input className={table_text_size}
                    id="card_id"
                    value={user.card_id}
                    onChange={(e) => setUser({ ...user, card_id: e.target.value })}
                    placeholder={t("rfid-msg")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">

            </CardFooter>
          </Card>
        )
      }
    </div >
  );
}