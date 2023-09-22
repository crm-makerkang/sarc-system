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
  const [employees, seteEmployees] = React.useState<string[]>([]);

  const [passwords, setePasswords] = React.useState<string[]>([]);

  const [dataModified, setDataModified] = React.useState(false);

  useEffect(() => {

    const getEmployees = async () => {
      const res = await axios.get('/api/employees/')
      console.log("in management page 70:", res.data);
      const return_employees = res.data;

      seteEmployees(return_employees);

      var pwd_encrypt = [];
      for (var i = 0; i < 5; i++) {
        if (return_employees[i] != "" && return_employees[i] != undefined) {
          //console.log("in management page 78:", employees[i]);   
          const res = await axios.post('/api/pwd_encrypt/',
            {
              username: return_employees[i]
            })
          pwd_encrypt.push(res.data.message);
          //console.log("in management page 84:", res.data.message);
        } else {
          pwd_encrypt.push("");
        }
      }
      setePasswords(pwd_encrypt);

    }

    getEmployees();

  }, [])

  useEffect(() => {
    //console.log("in management page 98:", employees);
    const updatePwd = async () => {
      var pwd_encrypt = [];
      for (var i = 0; i < 5; i++) {
        if (employees[i] != "" && employees[i] != undefined) {
          //console.log("in management page 103:", employees[i]);   
          const res = await axios.post('/api/pwd_encrypt/',
            {
              username: employees[i]
            })
          pwd_encrypt.push(res.data.message);
          //console.log("in management page 109:", res.data.message);
        } else {
          pwd_encrypt.push("");
        }
      }
      setePasswords(pwd_encrypt);
    }

    updatePwd();

  }, [employees])

  return (
    <>
      <div className='container flex items-start mt-12 justify-center '>

        <Card className="w-[850px]">
          <CardHeader>
            <CardTitle>{t("data-management")}</CardTitle>
          </CardHeader>
          <CardContent>
            <hr></hr>
            <div className="mt-4 flex flex-row items-center justify-around">
              <div className={"font-bold w-[200px] " + table_text_size}>
                {t("user-data") + ": "}
              </div>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("backup")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("recovery")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("import")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("export")}
              </Button>
              <Button className={'bg-red-500  ' + table_text_size}>
                {t("delete")}
              </Button>
            </div>
            <div className="mt-4 flex flex-row items-center justify-around">
              <div className={"font-bold w-[200px] " + table_text_size}>
                {t("measurements") + ": "}
              </div>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("backup")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("recovery")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("import")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("export")}
              </Button>
              <Button className={'bg-red-500  ' + table_text_size}>
                {t("delete")}
              </Button>
            </div>
            <hr className="mt-4"></hr>
            <hr className="mt-1"></hr>
          </CardContent>

          <CardHeader className="-mt-4">
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
                  value={employees[0]}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      var newEmployees = [];
                      for (var i = 0; i < 5; i++) {
                        newEmployees.push(employees[i])
                      }
                      newEmployees[0] = e.target.value;
                      seteEmployees(newEmployees);
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
                  value={employees[1]}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      var newEmployees = [];
                      for (var i = 0; i < 5; i++) {
                        newEmployees.push(employees[i])
                      }
                      newEmployees[1] = e.target.value;
                      seteEmployees(newEmployees);
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
                  value={employees[2]}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      var newEmployees = [];
                      for (var i = 0; i < 5; i++) {
                        newEmployees.push(employees[i])
                      }
                      newEmployees[2] = e.target.value;
                      seteEmployees(newEmployees);
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
                  value={employees[3]}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      var newEmployees = [];
                      for (var i = 0; i < 5; i++) {
                        newEmployees.push(employees[i])
                      }
                      newEmployees[3] = e.target.value;
                      seteEmployees(newEmployees);
                    }
                  }
                  placeholder={t('employee-name')}
                />
                <div className={"flex flex-row w-1/2 ml-10 " + table_text_size}>
                  {t('password') + " : " + passwords[3]}
                </div>
              </div>

              <div className="flex flex-row w-full space-y-1.5">
                <Input className={"flex flex-row w-1/2 justify-start " + table_text_size}
                  id="name"
                  value={employees[4]}
                  onChange={
                    (e) => {
                      setDataModified(true);
                      var newEmployees = [];
                      for (var i = 0; i < 5; i++) {
                        newEmployees.push(employees[i])
                      }
                      newEmployees[4] = e.target.value;
                      seteEmployees(newEmployees);
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
          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" className={table_text_size}
              onClick={async () => {
                window.location.reload();
              }}
            >
              {t("reload-data")}
            </Button>

            {dataModified && (
              <Button className={'bg-primary  ' + table_text_size}
                onClick={async () => {
                  const save_confirm = confirm(t("confirm-to-save-msg"));
                  console.log("in management page 302:", save_confirm);
                  if (save_confirm) {
                    const res = await axios.post('/api/employees/', {
                      "employees": employees
                    });
                    if (res.data.success) {
                      alert(t("save-ok-msg"));
                    } else {
                      alert(t("save-fail-msg"));
                    }
                  }
                }}
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