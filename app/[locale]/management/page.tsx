'use client';

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
  //console.log("start", props);
  const router = useRouter();
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
  const [employee1, seteEmployee1] = React.useState("");
  const [employee2, seteEmployee2] = React.useState("");
  const [employee3, seteEmployee3] = React.useState("");
  const [employee4, seteEmployee4] = React.useState("");
  const [employee5, seteEmployee5] = React.useState("");

  const [passwords, setePasswords] = React.useState<string[]>([]);

  const [dataModified, setDataModified] = React.useState(true);




  useEffect(() => {

    const getEmployees = async () => {
      const res = await axios.get('/api/employees/')
      console.log(res.data);
      const employees = res.data;
  
      seteEmployee1((employees[0] == undefined) ? "" : employees[0]);
      seteEmployee2((employees[1] == undefined) ? "" : employees[1]);
      seteEmployee3((employees[2] == undefined) ? "" : employees[2]);
      seteEmployee4((employees[3] == undefined) ? "" : employees[3]);
      seteEmployee5((employees[4] == undefined) ? "" : employees[4]);

      var pwd_encrypt=[];
      for (var i=0; i<5 ; i++) {
        if (employees[i]!="" && employees[i]!=undefined) {
          console.log("in management page 89:", employees[i]);   
          const res = await axios.post('/api/pwd_encrypt/',
            {
              username: employees[i]
            })
          pwd_encrypt.push(res.data.message);
          console.log("in management page 97:", res.data.message);
        } else {
          pwd_encrypt.push("");
        }
      }
      setePasswords(pwd_encrypt);
  
    }

    getEmployees();

  }, [])

  return (
    <>
      <div className='container flex items-start mt-12 justify-center '>
        <Card className="w-[550px]">
          <CardHeader>
            <CardTitle>{t('management-title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <hr></hr>
            <ul className="list-disc pl-4 pt-2 py-2">
              <li> {t('management-note1')} </li>
              <li> {t('management-note2')} </li>
              <li> {t('management-note3')} </li>
              <li> {t('management-note4')} </li>
            </ul>

            <div className="grid w-full items-center gap-4 mt-4">
              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employee1}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      seteEmployee1(e.target.value);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[0]}
                </div>
              </div>

              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employee2}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      seteEmployee2(e.target.value);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[1]}
                </div>
              </div>

              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employee3}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      seteEmployee3(e.target.value);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[2]}
                </div>
              </div>

              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employee4}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      seteEmployee4(e.target.value);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[4]}
                </div>
              </div>

              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employee5}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      seteEmployee5(e.target.value);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[4]}
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end">

            {dataModified && (
              <Button className={'bg-primary  ' + table_text_size}
              // onClick={async () => {
              //   //alert(t("save-msg"));

              //   // check data integrity
              //   const name_is_empty = user.name.length == 0;
              //   // name is valid, check if duplicated
              //   var name_is_duplicated = false;
              //   if (!name_is_empty) {
              //     for (let i = 0; i < userData.length; i++) {
              //       if (userData[i].name === user.name) {
              //         name_is_duplicated = true;
              //       }
              //     }
              //   }

              //   const card_no_is_invalid = !(/^\d{10}$/.test(user.card_no));

              //   const age_is_NaN = isNaN(parseInt(user.age));
              //   const age_out_range = (!age_is_NaN) && ((parseInt(user.age) < 20) || (parseInt(user.age) > 80));

              //   const height_is_NaN = isNaN(parseInt(user.height));
              //   const height_out_range = (!height_is_NaN) && ((parseInt(user.height) < 80) || (parseInt(user.height) > 210));

              //   const weight_is_NaN = isNaN(parseInt(user.weight));
              //   const weight_out_range = (!weight_is_NaN) && ((parseInt(user.weight) < 40) || (parseInt(user.weight) > 200));

              //   var data_err_msg = t("data-err-msg") + ":\n";
              //   data_err_msg = data_err_msg + ((!name_is_empty) ? "" : " - " + t("name-is-empty") + "\n");
              //   data_err_msg = data_err_msg + ((!name_is_duplicated) ? "" : " - " + t("name-is-duplicated") + "\n");
              //   data_err_msg = data_err_msg + ((!card_no_is_invalid) ? "" : " - " + t("card-no-is-invalid") + "\n");
              //   data_err_msg = data_err_msg + ((!age_is_NaN) ? "" : " - " + t("age-is-NaN") + "\n");
              //   data_err_msg = data_err_msg + ((!age_out_range) ? "" : " - " + t("age-out-range") + "\n");
              //   data_err_msg = data_err_msg + ((!height_is_NaN) ? "" : " - " + t("height-is-NaN") + "\n");
              //   data_err_msg = data_err_msg + ((!height_out_range) ? "" : " - " + t("height-out-range") + "\n");
              //   data_err_msg = data_err_msg + ((!weight_is_NaN) ? "" : " - " + t("weight-is-NaN") + "\n");
              //   data_err_msg = data_err_msg + ((!weight_out_range) ? "" : " - " + t("weight-out-range") + "\n");

              //   if (data_err_msg != (t("data-err-msg") + ":\n")) {
              //     alert(data_err_msg);
              //     return;
              //   }

              //   // simulate res for test
              //   // const res = {
              //   //   data: {
              //   //     message: "POST successful:",
              //   //     success: true,
              //   //   }
              //   // }

              //   const res = await axios.post('/api/users/',
              //     {
              //       "name": user.name,
              //       "card_no": user.card_no,
              //       "email": user.email,
              //       "phone": user.phone,
              //       "age": user.age,
              //       "gender": user.gender,
              //       "height": user.height,
              //       "weight": user.weight
              //     })

              //   console.log(res.data);
              //   if (res.data.success) {
              //     console.log("Save OK");
              //     alert(t('save-ok-msg'));
              //     setDataModified(false);
              //   } else {
              //     console.log("Save failed");
              //     alert(t('save-failed-msg'));
              //   }
              // }}
              >
                {t("save-data")}
              </Button>
            )}

          </CardFooter>
        </Card>

      </div >



    </>
  );
}