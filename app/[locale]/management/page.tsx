'use client';

import { useRouter } from "next/navigation";
import { UserInfo } from "@/types/types"
import { useTranslations } from 'next-intl';
import { table_text_size } from "@/Settings/settings"
import { Checkbox } from '@/components/ui/checkbox';
import * as React from "react"
import { useEffect } from "react";

import axios from "axios";
import { DateTime } from "luxon";

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
  // const [user, setUser] = React.useState<UserInfo>({
  //   id: "",
  //   name: "",
  //   card_no: "",
  //   email: "",
  //   phone: "",
  //   gender: "male",
  //   age: "",
  //   height: "",
  //   weight: ""
  // })
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const [showUsersFileList, setShowUsersFileList] = React.useState(false);
  const [showMeasurementsFileList, setShowMeasurementsFileList] = React.useState(false);
  const [showDataCard, setShowDataCard] = React.useState(true);
  const [showBinding, setshowBinding] = React.useState(false);

  const [userFileList, setUserFileList] = React.useState([]);
  const [matchedUserList, setMatchedUserList] = React.useState([]);
  const [matchedMeasurementsList, setMatchedMeasurementsList] = React.useState([]);
  const [employees, seteEmployees] = React.useState<string[]>(["", "", "", "", ""]);

  const [passwords, setePasswords] = React.useState<string[]>([]);

  const [dataModified, setDataModified] = React.useState(false);

  const [manegementAction, setManegementAction] = React.useState("");

  useEffect(() => {

    const getEmployees = async () => {
      const res = await axios.get('/api/employees/')
      console.log("in management page 72:", res.data);
      const return_employees = res.data;

      seteEmployees(return_employees);

      // var pwd_encrypt = [];
      // for (var i = 0; i < 5; i++) {
      //   if (return_employees[i] != "" && return_employees[i] != undefined) {
      //     //console.log("in management page 78:", employees[i]);   
      //     const res = await axios.post('/api/pwd_encrypt/',
      //       {
      //         username: return_employees[i]
      //       })
      //     pwd_encrypt.push(res.data.message);
      //     //console.log("in management page 84:", res.data.message);
      //   } else {
      //     pwd_encrypt.push("");
      //   }
      // }
      // setePasswords(pwd_encrypt);

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
              <div className={"font-bold w-1/2 " + table_text_size}>
                {t("database") + ": "}
              </div>
              <Button className={'bg-primary  ' + table_text_size}
                onClick={
                  async () => {
                    setShowUsersFileList(false);

                    // 使用 timeout 是避免 confirm 擋住前面 setShowUsersFileList(false); 執行
                    setTimeout(async () => {
                      if (confirm(t("sure-to-backup-msg"))) {
                        const res = await axios.get('/api/backup?cmd=backupDatabase');
                        console.log("in management page 137", res.data);
                        if (res.data == "OK") {
                          alert(t("backup-success-msg"));
                        }
                      }
                    }, 1)

                  }
                }
              >
                {t("backup")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}
                onClick={
                  async () => {
                    if (showUsersFileList && manegementAction == "recovery") {
                      // close file list
                      setShowUsersFileList(false);
                      setManegementAction("");
                      return
                    }

                    setManegementAction("recovery");
                    let matched = 0;
                    let toMatchedList: any = [];

                    const res = await axios.get('/api/backup?cmd=getFileList');
                    const fileList: [] = res.data.userFileList;

                    if (fileList.length < 2) {
                      alert(t("no-backup-found"));
                      return
                    }

                    fileList.map((filename: string, index) => {
                      toMatchedList[matched] = filename;
                      matched++;
                    })
                    console.log("in management page 149", toMatchedList);
                    setMatchedUserList(toMatchedList);
                    setShowUsersFileList(true);
                  }
                }
              >
                {t("recovery")}
              </Button>
              {/* <Button className={'bg-primary  ' + table_text_size}>
                {t("import")}
              </Button>
              <Button className={'bg-primary  ' + table_text_size}>
                {t("export")}
              </Button> */}
              <Button className={'bg-red-500  ' + table_text_size}
                onClick={
                  async () => {
                    if (showUsersFileList && manegementAction == "delete") {
                      setShowUsersFileList(false);
                      setManegementAction("");
                      return
                    }

                    setManegementAction("delete");
                    let matched = 0;
                    let toMatchedList: any = [];

                    const res = await axios.get('/api/backup?cmd=getFileList');
                    const fileList: [] = res.data.userFileList;

                    if (fileList.length < 2) {
                      alert(t("no-backup-found"));
                      return
                    }

                    fileList.map((filename, index) => {
                      toMatchedList[matched] = filename;
                      matched++;
                    })
                    console.log("in management page 223", toMatchedList);
                    setMatchedUserList(toMatchedList);
                    setShowUsersFileList(true);
                  }
                }
              >
                {t("delete")}
              </Button>
            </div>

            {showUsersFileList && (
              <div className="flex flex-col items-end">
                <ul
                  className="absolute w-[300px] py-2 px-8 bg-gray-200 
                          border border-gray-200 rounded-md  ">
                  {manegementAction == "delete" &&
                    <div>
                      <Button className={'bg-red-500  '}
                        onClick={
                          async () => {
                            if (manegementAction == "delete") {
                              if (confirm(t("sure-to-delete-msg"))) {
                                const res = await axios.get('/api/backup?cmd=deleteAllBackups');
                                console.log("in management page 244", res.data);
                                if (res.data == "OK") {
                                  alert(t("delete-success-msg"));
                                }
                              }
                            }
                            setShowUsersFileList(false);
                          }
                        }
                      >
                        {t("delete-all-msg")}
                      </Button>
                      <div className="mt-2 bg-gray-300  w-full h-[2px]"></div>
                    </div>
                  }

                  {
                    matchedUserList.map((item: string, index) => {
                      if (item != "users.json") {
                        const splitedName = item.split(".");
                        // const fileTime = new Date(parseInt(splitedName[2]))
                        // const fileTimeISO = fileTime.toISOString();
                        const fileTime = DateTime.fromMillis(parseInt(splitedName[2]));
                        const fileTimeISO = fileTime.toISO();
                        // const fileNameWithDate = "users.json : " + fileTimeISO!.substr(0, 10) + " " + fileTimeISO!.substr(11, 8);
                        const fileNameWithDate = fileTimeISO!.substr(0, 10) + " " + fileTimeISO!.substr(11, 8);

                        return <li key={index}
                          className={"py-2 cursor-pointer " + table_text_size}
                          onClick={async () => {
                            if (manegementAction == "recovery") {
                              if (confirm(t("sure-to-recovery-msg"))) {
                                const res = await axios.get('/api/backup?cmd=recoverDatabase&file=' + splitedName[2]);
                                console.log("in management page 279", res.data);
                                if (res.data == "OK") {
                                  alert(t("recovery-success-msg"));
                                } else {
                                  alert(t("recovery-failed-msg"));
                                }
                              }
                            }

                            if (manegementAction == "delete") {
                              if (confirm(t("sure-to-delete-msg"))) {
                                // const res = await axios.get('/api/backup?cmd=deleteUsersBackup&file=' + item);
                                const res = await axios.get('/api/backup?cmd=delteDatabaseBackup&file=' + splitedName[2]);
                                console.log("in management page 292", res.data);
                                if (res.data == "OK") {
                                  alert(t("delete-success-msg"));
                                }
                                else {
                                  alert(t("delete-failed-msg"));
                                }
                              }
                            }
                            setShowUsersFileList(false);
                          }
                          }
                        >
                          {fileNameWithDate}
                        </li>
                      }
                    })
                  }
                </ul>
              </div>
            )}

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