'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowDown, Check, X, Dot} from "lucide-react"
import { DateTime } from "luxon";
import { UserInfo, Diagnose } from "@/types/types"

import { table_text_size } from "@/Settings/settings"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

import axios from "axios";
import { jsPDF } from "jspdf"

export default function Index(props: any) {
  console.log("in diagnose page 50:", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  const [showPrimary, setShowPrimary] = React.useState(true);
  const [showHospital, setShowHospital] = React.useState(false);
  const [assessmentStandard, setAssessmentStandard] = React.useState("AWGS 2019");
  const [assessmentType, setAssessmentType] = React.useState(t("primary-care"));
  const [showStandard, setShowStandard] = React.useState(false);
  const [showType, setShowType] = React.useState(false);
  const [locale, setLocale] = React.useState(props.params.locale);

  const [showSearch, setShowSearch] = React.useState(false);
  const [showDiagnoseList, setShowDiagnoseList] = React.useState(false);
  const [diagnoseList, setDiagnoseList] = React.useState([["", ""]]);

  const [matchedList, setMatchedList] = React.useState([]);
  const [userData, setUserData] = React.useState<UserInfo[]>([]);
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
  });

  const [diagnoses, setDiagnoses] = React.useState<Diagnose[]>([]);
  const [diagnose, setDiagnose] = React.useState<Diagnose>({
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
    rid: "",
    dia_id: "",
    dia_datetime: "",
    dia_result: "",
    dia_examiner: "",
    sarc_f_Q1: "",
    sarc_f_Q2: "",
    sarc_f_Q3: "",
    sarc_f_Q4: "",
    sarc_f_Q5: "",
    sarc_f_score: "",
    sarc_calf_score: "",
    sppb_score: "",
    primary_comments: "",
    clinicalIssues: "",
    hospital_comments: ""
  });

  const [vaildUser, setVaildUser] = React.useState(false);

  const [date, setDate] = React.useState<Date>(); // shadcn date picker

  const [primaryScreeningPass, setPrimaryScreeningPass] = React.useState(true);
  const [primaryEvaluatePass, setPrimaryEvaluatePass] = React.useState(true);

  const [clinicalIssue, setClinicalIssue] = React.useState(false);
  const [hospitalScreeningPass, setHospitalScreeningPass] = React.useState(true);
  const [hospitalEvaluatePass, setHospitalEvaluatePass] = React.useState(true);
  const [hospitalGripPass, setHospitalGripPass] = React.useState(true);
  const [hospitalPerformancePass, setHospitalPerformancePass] = React.useState(true);
  const [hospitalASMIPass, setHospitalASMIPass] = React.useState(true);

  const [primaryDiagnoseResult, setPrimaryDiagnoseResult] = React.useState("");
  const [hospitalDiagnoseResult, setHospitalDiagnoseResult] = React.useState("");

  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    //console.log(res.data);
    setUserData(res.data);
  }

  const getDiagnoses = async () => {
    const res = await axios.get('/api/diagnoses/')
    console.log("in diagnoses page 88:", res.data);
    setDiagnoses(res.data);
  }

  useEffect(() => {
    getUsers();
    getDiagnoses();
    //const nowDateTime = DateTime.now().toString();
    setDate(new Date());
  }, [])

  useEffect(() => {
    // Primary screening
    (((user.gender == "male")
      ? ((parseFloat(diagnose.calf_grith) < 34.0) ? true : false)
      : ((parseFloat(diagnose.calf_grith) < 33.0) ? true : false))
      || (parseInt(diagnose.sarc_f_score) > 3)
      || (parseInt(diagnose.sarc_calf_score) > 10))
      ? setPrimaryScreeningPass(false) : setPrimaryScreeningPass(true);

    // Primary evaluate
    (((user.gender == "male")
      ? ((parseFloat(diagnose.grip_strength) < 28.0) ? true : false)
      : ((parseFloat(diagnose.grip_strength) < 18.0) ? true : false))
      || (parseFloat(diagnose.chair_standup5) > 12.0))    
      ? setPrimaryEvaluatePass(false) : setPrimaryEvaluatePass(true);

    // Clinical issue and hospital screening
    if (diagnose.clinicalIssues=="Y") {
      setClinicalIssue(true);
      setHospitalScreeningPass(false);
    } else {
      setHospitalScreeningPass(primaryScreeningPass);
    }

    // Hospital evaluate
    const gripPass = ((user.gender == "male")
      ? ((parseFloat(diagnose.grip_strength) < 28.0) ? false : true) 
      : ((parseFloat(diagnose.grip_strength) < 18.0) ? false : true))
    setHospitalGripPass(gripPass);

    const performancePass = !( (parseFloat(diagnose.chair_standup5) > 12.0) ||
                               (parseFloat(diagnose.gait_speed6) > 6.0)     ||
                               (parseInt(diagnose.sppb_score) <10)
                            );
    setHospitalPerformancePass(performancePass);
    
    const ASMIPass = ((user.gender == "male")
    ? ((parseFloat(diagnose.muscle_quantity) < 7.0) ? false : true) 
    : ((parseFloat(diagnose.muscle_quantity) < 5.7) ? false : true));
    setHospitalASMIPass(ASMIPass);

    setHospitalEvaluatePass(gripPass && performancePass && ASMIPass);

    console.log("in diagnose page 173:", diagnose.muscle_quantity, ASMIPass);


  }, [diagnose])

  return (

    <div className="mt-12 flex flex-col w-full items-center justify-evenly ">

      <div className="flex flex-row w-8/12 items-center justify-evenly">

        <div className="flex flex-col space-y-1.5">

          <div className="flex flex-row ml-24 justify-start">
            <Label className="-ml-24 pt-1 text-2xl" htmlFor="diag_name">姓名：</Label>
            <Input className="text-xl border border-gray-500 w-[200px]"
              id="diag_name"
              value={user.name}
              onChange={
                (e) => {
                  setUser({ ...user, name: e.target.value });
                  setVaildUser(false);
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

          {showSearch && matchedList.length > 0 && (
            <div className="">
              <ul
                className="z-10 absolute w-[660px] ml-24  -mt-2 py-2 px-8 bg-gray-200 
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
                            setVaildUser(true);
                            break;
                          }
                        }

                        setShowSearch(false);
                        setShowDiagnoseList(false);
                      }
                    }
                  >
                    {item}
                  </li>
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col ">
          <Button className="text-2xl" variant={"outline"}
            onClick={() => {
              if (vaildUser) {
                if (showDiagnoseList) {
                  setShowDiagnoseList(false);
                  setShowSearch(false);
                  setShowStandard(false);
                  setShowType(false);
                  return;
                }

                let matched = 0;
                let toMatchedList: any = [];
                for (let i = 0; i < diagnoses.length; i++) {
                  // for (var j = 0; j < userData.length; j++) {
                  //   if (diagnoses[i].uid == userData[j].id) {
                  //     toMatchedList[matched] = [i.toString(), diagnoses[i].dia_datetime];
                  //     matched++;
                  //   }
                  // }
                  if (diagnoses[i].uid == user.id) {
                    toMatchedList[matched] = [i.toString(), diagnoses[i].dia_datetime];
                    matched++;
                  }ArrowDown
                }
                setDiagnoseList(toMatchedList);
                if (matched == 0) {
                  toMatchedList[matched] = ["0", t("no-diag-data")];
                }

                setShowDiagnoseList(true);
                setShowSearch(false);
                setShowStandard(false);
                setShowType(false);

              } else {
                alert(t("select-a-user"));
              }
            }}
          >
            {t('diagnose-records')}
            <ArrowDown className="ml-2 h-6 w-6" />
          </Button>
          {showDiagnoseList && (
            <div className="">
              <ul
                className="z-10 absolute w-[300px] py-2 px-8 bg-gray-200 
                           border border-gray-200 rounded-md  ">
                {diagnoseList.map((item, index) => {
                  return <li key={index}
                    className={"py-2 cursor-pointer " + table_text_size}
                    onClick={
                      () => {
                        if (item[1] != t("no-diag-data")) {
                          setDiagnose(diagnoses[parseInt(item[0])]);
                        }
                        setShowDiagnoseList(false);
                      }
                    }
                  >
                    {item[1]}
                  </li>
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col ">
          <Button className="w-[220px] font-bold text-2xl opacity-90" variant={"outline"}
            onClick={
              () => {
                setShowStandard(!showStandard);
                setShowType(false);
                setShowDiagnoseList(false);
                setShowSearch(false);
              }
            }
          >
            {assessmentStandard}
            <ArrowDown className="ml-2 h-6 w-6" />
          </Button>

          {showStandard && (
            <div className="w-full flex flex-row justify-start z-10">
              <ul
                className="absolute ml-4 py-2 px-8 bg-gray-200
                                border border-gray-200 rounded-md  ">
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentStandard("AWGS 2019");
                      setShowDiagnoseList(false);
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
                setShowDiagnoseList(false);
                setShowSearch(false);
              }
            }
          >
            {assessmentType}
            <ArrowDown className="ml-2 h-6 w-6" />
          </Button>

          {showType && (
            <div className="w-full flex flex-row justify-center z-10">
              <ul
                className="absolute py-2 px-8 bg-gray-200 
                                border border-gray-200 rounded-md  ">
                <li
                  className={"py-2 cursor-pointer " + table_text_size}
                  onClick={
                    () => {
                      setAssessmentType(t("primary-care"));
                      setShowType(false);
                      setShowPrimary(true);
                      setShowHospital(false);
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
                      setShowHospital(true);
                      setShowPrimary(false);
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
              {/* 基層上層篩檢*/}
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                <div className="flex flex-row items-start justify-center">
                  <div className="w-[300px] h-[190px] ml-[200px] text-xl rounded-2xl mt-3">
                    <div className="flex flex-col items-start justify-start p-4 ml-10">

                      <div className=" bg-white">診斷日期：</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            ) + " text-xl w-[220px]  border-gray-400"}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <div className="mt-4 bg-white">姓名：
                        <span className="ml-4">{user.name = (vaildUser) ? user.name : ""}</span>
                      </div>
                      <div className="mt-2 bg-white">年齡：
                        <span className="ml-4">{user.age = (vaildUser) ? user.age : ""}</span>
                      </div>
                      <div className="mt-2 bg-white">性別：
                        <span className="ml-4">
                          {(vaildUser) ? (user.gender == "male" ? "男" : "女") : ""}
                        </span>
                      </div>

                      {vaildUser && (
                        <>
                          <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                          <div className="mt-4 bg-white">{t("new-diagnose")}：</div>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得量測資料
                          </Button>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得 SARC-ClaF 問卷
                          </Button>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得 SPPB 量表
                          </Button>
                        </>
                      )}

                    </div>
                  </div>
                  {/* 基層篩檢 */}
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">篩檢:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"小腿圍： 男<34公分，女<33公分"}</div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.calf_grith) < 34) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.calf_grith) < 33) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2"}
                        >
                          {diagnose.calf_grith} 公分</div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-F 問卷 >= 4 分"}</div>
                        <div className={
                          ((parseInt(diagnose.sarc_f_score) > 3) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {(diagnose.sarc_f_score == "") ? "" : diagnose.sarc_f_score} 分
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-CalF 問卷 >= 11 分"}</div>
                        <div className={
                          ((parseInt(diagnose.sarc_calf_score) > 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {(diagnose.sarc_calf_score == "") ? "" : diagnose.sarc_calf_score} 分
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>

                <img src={primaryScreeningPass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
                  className="h-[50px] w-[40px]">
                </img>

              </div>

              {/* 基層中層評估*/}
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl"></div>
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">評估:</div>
                      <div className="text-xl font-bold ml-4">肌肉力量:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"握力: 男<28公斤，女<18公斤"}</div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.grip_strength) < 28) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.grip_strength) < 18) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.grip_strength} 公斤</div>
                      </div>
                      <div className="text-xl font-bold ml-4">體能表現:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"五次起立坐下: >=12 秒"}</div>
                        <div className={
                          ((parseFloat(diagnose.chair_standup5) > 12.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.chair_standup5} 秒</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>

                <img src={primaryEvaluatePass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
                  className="h-[50px] w-[40px]">
                </img>

              </div>

              {/* 基層下層診斷 */}
              <div className="flex flex-col w-full h-full mx-4 mb-8 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl"></div>
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-bold mb-2">診斷:
                        {(primaryEvaluatePass && primaryScreeningPass) && (
                          <span className="text-green-700"> 肌少症機率低</span> 
                        )}             
                        {!(primaryEvaluatePass && primaryScreeningPass) && (
                          <span className="text-red-500"> 可能肌少症</span> 
                        )}  
                        </div>

                        <Button className="bg-primary text-white text-xl -mt-4 w-[100px]"
                          onClick={() => {
                            console.log("in diagnoses oage 373:", date)
                            //setDate(new Date("2023-10-05"));
                          }}
                        >
                          儲存
                        </Button>
                      </div>

                      {(primaryEvaluatePass && primaryScreeningPass) && (
                        <div className="ml-16">
                          <div className="flex flex-row items-center justify-start">
                            1.
                            <div className="ml-2">此為初步診斷，若有疑慮，請諮詢醫師</div></div>
                          <div>2. 請注重營養及保持運動</div>
                        </div>
                      )}

                      {!(primaryEvaluatePass && primaryScreeningPass) && (
                        <div className="ml-16">
                          <div className="flex flex-row items-center justify-start">
                            1.
                            <div className="ml-2">此為初步診斷，請至醫院進行進一步診斷確認</div></div>
                          <div>2. 請諮詢醫師進行『營養及運動生活型態調整』</div>
                        </div>
                      )}


                      <div className="flex flex-row items-center justify-start mt-4">
                        <Label className="text-xl w-2/12" htmlFor="examiner">診斷者：</Label>
                        <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                          id="examiner" placeholder="名字"
                          value={diagnose.dia_examiner}
                        />
                      </div>

                      <div className="mt-2">
                        備註:
                      </div>

                      <Textarea className="ml-[86px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400"
                        id="description" value={diagnose.primary_comments
                        } />


                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="flex flex-row w-full items-center justify-center">
          {showHospital && (assessmentStandard == "AWGS 2019") && (
            <div className="w-7/12 mt-4">
              {/* 醫院上層篩檢*/}
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">              
                <div className="flex flex-row items-start justify-center">
                  <div className="w-[300px] h-[190px] ml-[200px] text-xl rounded-2xl mt-3">
                    <div className="flex flex-col items-start justify-start p-4 ml-10">
                      <div className=" bg-white">診斷日期：</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            ) + " text-xl w-[220px]  border-gray-400"}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <div className="mt-4 bg-white">姓名：
                        <span className="ml-4">{user.name = (vaildUser) ? user.name : ""}</span>
                      </div>
                      <div className="mt-2 bg-white">年齡：
                        <span className="ml-4">{user.age = (vaildUser) ? user.age : ""}</span>
                      </div>
                      <div className="mt-2 bg-white">性別：
                        <span className="ml-4">
                          {(vaildUser) ? (user.gender == "male" ? "男" : "女") : ""}
                        </span>
                      </div>

                      {vaildUser && (
                        <>
                          <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                          <div className="mt-4 bg-white">{t("new-diagnose")}：</div>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得量測資料
                          </Button>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得 SARC-ClaF 問卷
                          </Button>

                          <Button className="w-[220px] mt-2 text-lg border-gray-400" variant={"outline"}
                          >
                            取得 SPPB 量表
                          </Button>
                        </>
                      )}

                    </div>
                  </div>
                  {/* 醫院篩檢 */}
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">篩檢:</div>
                      <div className="flex flex-row justify-start">
                        <input type="checkbox" className="mt-1 ml-4 w-4 h-4" checked={clinicalIssue} 
                          onClick={() => {
                            if (vaildUser) {
                              if (clinicalIssue) {
                                setClinicalIssue(false);
                              } else {
                                setClinicalIssue(true);
                              }
                            }
                          }}
                        />
                        <div className="text-xl font-bold mb-2 ml-4">呈現任一臨床問題:</div>
                      </div>
                      <div className="text-xl mb-2 ml-4">
                        <div>功能下降及受限; 不明原因體重減輕; 憂鬱; 認知障礙; 反覆性跌倒;</div> 
                        <div>營養不良; 慢性疾病(心衰竭; 慢性阻塞性肺病; 糖尿病; 慢性腎臟病等)</div>
                      </div>

                      <div className="w-11/12 h-[2px] bg-gray-400 m-4"> </div>

                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 小腿圍： 男<34公分，女<33公分"}</div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.calf_grith) < 34) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.calf_grith) < 33) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2"}
                        >
                          {diagnose.calf_grith} 公分</div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-F 問卷 >= 4 分"}</div>
                        <div className={
                          ((parseInt(diagnose.sarc_f_score) > 3) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {(diagnose.sarc_f_score == "") ? "" : diagnose.sarc_f_score} 分
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"或 SARC-CalF 問卷 >= 11 分"}</div>
                        <div className={
                          ((parseInt(diagnose.sarc_calf_score) > 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[100px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {(diagnose.sarc_calf_score == "") ? "" : diagnose.sarc_calf_score} 分
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
                <img src={hospitalScreeningPass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
                  className="h-[50px] w-[40px]">
                </img>
              </div>

              {/* 醫院中層評估*/}
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                  <div className="flex flex-row items-center justify-center">
                    <div className="w-[500px] h-[100px] text-xl">
                    </div>
                    <div className="w-[700px] flex flex-col items-center">
                      <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                        <div className="text-2xl font-bold mb-2">評估:</div>
                        <div className="text-xl font-bold ml-4">肌肉力量:</div>
                        <div className="flex flex-row items-center justify-between">
                          <div className="ml-8">{"握力: 男<28公斤，女<18公斤"}</div>
                          <div className={((user.gender == "male")
                            ? (parseFloat(diagnose.grip_strength) < 28.0) ? "bg-red-500" : "bg-green-700"
                            : (parseFloat(diagnose.grip_strength) < 18.0) ? "bg-red-500" : "bg-green-700")
                            + " text-white p-1 rounded-md w-[100px]"
                            + " flex items-center justify-end pr-2"}
                          >{diagnose.grip_strength} 公斤</div>
                        </div>
                        <div className="text-xl font-bold ml-4">體能表現:</div>
                        <div className="flex flex-row items-center justify-between">
                          <div className="ml-14">{"五次起立坐下: >=12 秒"}</div>
                          <div className={
                            ((parseFloat(diagnose.chair_standup5) > 12.0) ? "bg-red-500" : "bg-green-700")
                            + " text-white p-1 rounded-md w-[100px]"
                            + " flex items-center justify-end pr-2"}
                          >{diagnose.chair_standup5} 秒</div>
                        </div>
                        <div className="flex flex-row mt-1 items-center justify-between">
                          <div className="ml-8">{"或 六公尺步行速度: >6 秒 (< 1.0 公尺/秒)"}</div>
                          <div className={
                            ((parseFloat(diagnose.gait_speed6) > 6.0) ? "bg-red-500" : "bg-green-700")
                            + " text-white p-1 rounded-md w-[100px]"
                            + " flex items-center justify-end pr-2"}
                          >{ diagnose.gait_speed6 } 秒</div>
                        </div>     
                        <div className="flex flex-row mt-1 items-center justify-between">
                          <div className="ml-8">{"或 簡易身體功能量表 SPPB: <= 9 分"}</div>
                          <div className={
                            ((parseInt(diagnose.sppb_score) < 10) ? "bg-red-500" : "bg-green-700")
                            + " text-white p-1 rounded-md w-[100px]"
                            + " flex items-center justify-end pr-2"}
                          >{diagnose.sppb_score} 分</div>
                        </div>  

                        <div className="text-xl font-bold mt-2 ml-4">肌肉質量(ASMI): kg/m2</div>
                        <div className="flex flex-row items-center justify-between">
                          <div className="ml-14">{"BIA： 男<7.0 ，女< 5.7 "}</div>
                          <div className={
                            (
                              (user.gender == "male") 
                              ? ((parseFloat(diagnose.muscle_quantity) < 7.0) ? "bg-red-500" : "bg-green-700")
                              : ((parseFloat(diagnose.muscle_quantity) < 5.7) ? "bg-red-500" : "bg-green-700")
                            )
                            + " text-white p-1 rounded-md w-[100px]"
                            + " flex items-center justify-end pr-2"}
                          >{diagnose.muscle_quantity} <span className="text-sm ml-1 ">kg/m2</span></div>
                        </div> 
                                                                                     
                      </div>                      
                    </div>
                    <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                  </div>

                <img src={primaryEvaluatePass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
                  className="h-[50px] w-[40px]">
                </img>

              </div>

              {/* 醫院下層診斷 */}
              <div className="flex flex-col w-full h-full mx-4 mb-8 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl">
                  </div>
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-bold mb-2">診斷:
                          <span className="text-red-500">
                            { 
                              ( 
                              (!hospitalGripPass && !hospitalASMIPass && !hospitalPerformancePass) 
                              ? " 嚴重肌少症" 
                              : ((!hospitalGripPass && !hospitalASMIPass) 
                              ? " 肌少症"
                              : "")
                              )
                              
                            }
                            </span>
                        </div>

                        <Button className="bg-primary text-white text-xl -mt-4 w-[100px]"
                          onClick={() => {
                            console.log("in diagnoses page 825:", date)
                            
                          }}
                        >
                          儲存
                        </Button>
                      </div>

                      <div className="flex flex-row items-center justify-between">

                        <div className="ml-14 mt-2  text-2xl  font-bold text-red-500">
                          {clinicalIssue && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              - 有臨床問題，請洽相關專科醫師協助。
                            </div>
                          )}

                          {!primaryScreeningPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              - 小腿圍 或 <span className="text-lg">SRAC-F</span> 問卷未通過標準
                            </div>
                          )}

                          {!hospitalGripPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              - 低肌肉力量
                            </div>
                          )}

                          {!hospitalASMIPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              - 低肌肉質量
                            </div>
                          )}

                          {!hospitalPerformancePass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              - 低體能表現
                            </div>
                          )}

                        </div>

                      </div>



                      <div className="flex flex-row items-center justify-start mt-4">
                        <Label className="text-xl w-2/12" htmlFor="examiner">診斷者：</Label>
                        <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                          id="examiner" placeholder="名字"
                          value={diagnose.dia_examiner}
                        />
                      </div>

                      <div className="mt-2">
                        備註:
                      </div>

                      <Textarea className="ml-[86px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400"
                        id="description" value={diagnose.hospital_comments} 
                      />

                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>

    </div >

  );
}