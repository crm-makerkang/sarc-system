'use client';

// PARQ 參考 https://github.com/parqform/webform/blob/main/index.html

import { useRouter, useSearchParams } from "next/navigation";
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
  //console.log("start", props);

  const router = useRouter();
  const searchParams = useSearchParams()

  const t = useTranslations('sarc');
  const [user, setUser] = React.useState<UserInfo>({
    id: "",
    name: "",
    card_no: "",
    email: "",
    phone: "",
    gender: "male",
    age: "",
    height: "",
    weight: ""
  })
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const [showSearch, setShowSearch] = React.useState(false);
  const [showDataCard, setShowDataCard] = React.useState(true);
  const [showBinding, setshowBinding] = React.useState(false);

  const [matchedList, setMatchedList] = React.useState([]);
  const [userData, setUserData] = React.useState<UserInfo[]>([]);

  const [dataModified, setDataModified] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);


  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    console.log(res.data);
    setUserData(res.data);
  }

  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    const user_id = searchParams.get('id')
    console.log("in start page 79:", user_id);

    if (user_id != null) {

      for (let i = 0; i < userData.length; i++) {
        // if (userData[i].id === props.searchParams.id) { // props.searchParams.id works with npm run dev, but fails after build
        if (userData[i].id === user_id) {
          console.log(userData[i]);
          setUser(userData[i]);
          setDataModified(false);
        }
      }
    }
  }, [userData])

  useEffect(() => {
    // @ts-ignore // 實在沒辦法，只好用粗暴的解法
    document.getElementById("gender_select").value = t(user.gender);
  }, [user])

  useEffect(() => {

  }, [privacy])

  const saveUser = async () => {
    //alert(t("save-msg"));

    // check data integrity
    const name_is_empty = user.name.length == 0;
    // name is valid, check if duplicated
    var name_is_duplicated = false;
    if (!name_is_empty) {
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].name === user.name) {
          name_is_duplicated = true;
        }
      }
    }

    const card_no_is_invalid = !(/^\d{10}$/.test(user.card_no));

    const age_is_NaN = isNaN(parseInt(user.age));
    const age_out_range = (!age_is_NaN) && ((parseInt(user.age) < 20) || (parseInt(user.age) > 80));

    const height_is_NaN = isNaN(parseInt(user.height));
    const height_out_range = (!height_is_NaN) && ((parseInt(user.height) < 80) || (parseInt(user.height) > 210));

    const weight_is_NaN = isNaN(parseInt(user.weight));
    const weight_out_range = (!weight_is_NaN) && ((parseInt(user.weight) < 40) || (parseInt(user.weight) > 200));

    var data_err_msg = t("data-err-msg") + ":\n";
    data_err_msg = data_err_msg + ((!name_is_empty) ? "" : " - " + t("name-is-empty") + "\n");
    // data_err_msg = data_err_msg + ((!name_is_duplicated) ? "" : " - " + t("name-is-duplicated") + "\n");
    data_err_msg = data_err_msg + ((!card_no_is_invalid) ? "" : " - " + t("card-no-is-invalid") + "\n");
    data_err_msg = data_err_msg + ((!age_is_NaN) ? "" : " - " + t("age-is-NaN") + "\n");
    data_err_msg = data_err_msg + ((!age_out_range) ? "" : " - " + t("age-out-range") + "\n");
    data_err_msg = data_err_msg + ((!height_is_NaN) ? "" : " - " + t("height-is-NaN") + "\n");
    data_err_msg = data_err_msg + ((!height_out_range) ? "" : " - " + t("height-out-range") + "\n");
    data_err_msg = data_err_msg + ((!weight_is_NaN) ? "" : " - " + t("weight-is-NaN") + "\n");
    data_err_msg = data_err_msg + ((!weight_out_range) ? "" : " - " + t("weight-out-range") + "\n");

    if (data_err_msg != (t("data-err-msg") + ":\n")) {
      alert(data_err_msg);
      return;
    }

    if (name_is_duplicated) {
      if (searchParams.get('id') == null) {
        alert(t("name-is-duplicated"));
        return;
      } else {
        if (!(confirm(t("name-is-duplicated") + ", " + t("confirm-to-modify-msg")))) {
          return;
        }
      }
    }

    const res = await axios.post('/api/users/',
      {
        "id": user.id,
        "name": user.name,
        "card_no": user.card_no,
        "email": user.email,
        "phone": user.phone,
        "age": user.age,
        "gender": user.gender,
        "height": user.height,
        "weight": user.weight
      })

    console.log(res.data);

    if (res.data.success) {
      console.log("Save OK");
      alert(t('save-ok-msg'));
      setDataModified(false);
    } else {
      console.log("Save failed");
      alert(t('save-failed-msg'));
    }

  }

  return (
    <div className='container flex items-start mt-12 justify-center '
      style={{
        // backgroundImage: 'url(/img/bg-start-credit.png)',
        // backgroundSize: 'cover', backgroundPosition: 'top',
        //height: '91vh', width: '100%'
      }}
    >
      {showDataCard && (
        <Card className="w-[850px]">
          <CardHeader>
            <CardTitle>{t('user-info')} <span className="text-red-500 text-lg">{t('required-msg')}</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">

              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="name">{t('name')}*</Label>
                <Input className={table_text_size}
                  id="name"
                  value={user.name}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      setUser({ ...user, name: e.target.value });
                      setShowSearch(false);
                      let matched = 0;
                      let toMatchedList: any = [];
                      userData.map((user, index) => {
                        if ((matched < 10) && (user.name.includes(e.target.value))) {
                          toMatchedList[matched] = (user.name);
                          matched++;
                        }
                      })
                      setMatchedList(toMatchedList);
                      if (matched > 0) {
                        setShowSearch(true);
                      } else {
                        //不好處理，先不處理
                      }

                    }
                  }
                  placeholder={t('your-name')}
                />
              </div>

              {/* {showSearch && matchedList.length > 0 && ( */}
              {false && matchedList.length > 0 && (
                <div className="">
                  <ul
                    className="absolute w-[660px] ml-32 -mt-4 py-2 px-8 bg-gray-200 
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
                                setDataModified(false);
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
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="card_no">{t("card-no")}*</Label>
                <Input className={table_text_size}
                  id="card_no"
                  value={user.card_no}
                  onChange={(e) => {
                    setUser({ ...user, card_no: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t("card-no")}
                />
              </div>

              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="phone">{t('phone')}</Label>
                <Input className={table_text_size}
                  id="phone"
                  value={user.phone}
                  onChange={(e) => {
                    setUser({ ...user, phone: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t('phone')}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="email">{t('email')}</Label>
                <Input className={table_text_size}
                  id="email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t('email')}
                />
              </div>
            </div>

            <hr className='m-4'></hr>
            <div className="mb-2 text-lg text-red-500 font-bold ">{t('bio-msg')}</div>

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="gender">{t('bio-gender')}*</Label>

                <select id="gender_select" className={
                  "w-24 -ml-8 p-1 border rounded-md text-gray-500 " +
                  "focus:border-gray-500 focus:outline-none focus:border-2 focus:rounded-xl " +
                  table_text_size}
                  onChange={(e) => {
                    setUser({ ...user, gender: e.target.value == t("male") ? "male" : "female" });
                    setDataModified(true);
                  }}
                >
                  <option value={t("male")}>{t("male")}</option>
                  <option value={t("female")}>{t("female")}</option>
                </select>
              </div>

              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="age">{t("age")}*</Label>
                <Input className={table_text_size}
                  id="age"
                  value={user.age}
                  onChange={(e) => {
                    setUser({ ...user, age: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t("age")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="height">{t("height")}*</Label>
                <Input className={table_text_size}
                  id="height"
                  value={user.height}
                  onChange={(e) => {
                    setUser({ ...user, height: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t("height")}
                />
              </div>
              <div className="flex flex-row space-y-1.5">
                <Label className={"w-44 pt-3 " + table_text_size} htmlFor="weight">{t("weight")}*</Label>
                <Input className={table_text_size}
                  id="weight"
                  value={user.weight}
                  onChange={(e) => {
                    setUser({ ...user, weight: e.target.value });
                    setDataModified(true);
                  }}
                  placeholder={t("weight")}
                />
              </div>
            </div>

            <hr className='m-4'></hr>

            <input className="mx-4 " type="checkbox" id="privacy" name="privacy"
              style={{ width: '20px', height: '20px' }}
              // @ts-ignore // 實在沒辦法，只好用粗暴的解法
              onClick={(e) => { e.target.checked ? setPrivacy(true) : setPrivacy(false) }}
            />
            <span className="align-top">{t('agree-privacy-msg')}
              <a href="/privacy-policy" className="underline"> {t('privacy-policy')} </a>
            </span>

          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" className={table_text_size}
              onClick={async () => {
                window.location.reload();
              }}
            >
              {t("clear-data")}
            </Button>

            {dataModified && privacy && (
              <Button className={'bg-primary  ' + table_text_size}
                onClick={async () => {
                  saveUser();
                  if (searchParams.get('id') != null) window.location.href = '/users';
                }}
              >
                {t("save-data")}
              </Button>
            )}
          </CardFooter>
        </Card>
      )
      }

    </div >
  );
}