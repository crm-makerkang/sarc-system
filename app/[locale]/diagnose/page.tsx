'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowDown, Check, X, Dot, Plus } from "lucide-react"
import { DateTime } from "luxon";
import moment from 'moment';
import { UserInfo, Diagnose, Measurement } from "@/types/types"
import { v4 as uuidv4 } from 'uuid';

import { table_text_size, dia_type, dia_standard } from "@/Settings/settings"
import { awgs2019_primary_dataURL, awgs2019_hospital_dataURL, ewgsop2_dataURL } from "@/models/imagesDataURL"

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
import { validate } from "uuid";

export default function Index(props: any) {
  //console.log("in diagnose page 50:", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  const [showPrimary, setShowPrimary] = React.useState(true);
  const [showHospital, setShowHospital] = React.useState(false);
  const [assessmentStandard, setAssessmentStandard] = React.useState("AWGS 2019");
  const [assessmentType, setAssessmentType] = React.useState(t("primary-care"));
  const [showStandard, setShowStandard] = React.useState(false);
  const [showType, setShowType] = React.useState(false);
  const [showNewDiagnose, setShowNewDiagnose] = React.useState(false);
  const [locale, setLocale] = React.useState(props.params.locale);

  const [showSearch, setShowSearch] = React.useState(false);
  const [showMeasurementList, setShowMeasurementList] = React.useState(false);
  const [measurementList, setMeasurementList] = React.useState([["", ""]]);
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


  const [measurements, setMeasurements] = React.useState<Measurement[]>([]);
  const [measurement, setMeasurement] = React.useState<Measurement>({
    "datetime": "",
    "name": "",
    "calf_girth": "0",
    "grip_strength": "",
    "chair_standup5": "",
    "muscle_quantity": "",
    "gait_speed4": "",
    "gait_speed6": "",
    "balanceA": "",
    "balanceB": "",
    "balanceC": "",
    "asm": "",
    "tug": "",
    "walk_400m": "",
    "uid": "",
    "rid": ""
  });

  const [diagnoses, setDiagnoses] = React.useState<Diagnose[]>([]);
  const [diagnose, setDiagnose] = React.useState<Diagnose>({
    calf_girth: "",
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
    primary_examiner: "",
    hospital_examiner: "",
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
    hospital_comments: "",
    asm: "",
    tug: "",
    walk_400m: ""
  });

  const [validUser, setValidUser] = React.useState(false);

  const [date, setDate] = React.useState<Date>(); // shadcn date picker

  const [primaryScreeningPass, setPrimaryScreeningPass] = React.useState(true);
  const [primaryEvaluatePass, setPrimaryEvaluatePass] = React.useState(true);

  const [clinicalIssues, setClinicalIssues] = React.useState(false);
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

  const getMeasurements = async () => {
    const res = await axios.get('/api/measurements/')
    // console.log("in diagnose page 166:", res.data);
    setMeasurements(res.data);
  }

  const getDiagnoses = async () => {
    const res = await axios.get('/api/diagnoses/')
    // console.log("in diagnoses page 136:", res.data);
    setDiagnoses(res.data);
  }

  const newDiagnose = () => {
    const momentNow = moment().format(); // moment,js => 2023-10-15T21:34:52+08:00
    console.log("in diagnose page 178:", typeof momentNow, momentNow);
    const blankDiagnose: Diagnose = {
      calf_girth: "",
      grip_strength: "",
      chair_standup5: "",
      muscle_quantity: "",
      gait_speed4: "",
      gait_speed6: "",
      balanceA: "",
      balanceB: "",
      balanceC: "",
      uid: user.id,
      rid: "",
      dia_id: uuidv4(),
      dia_datetime: momentNow.substring(0, 10) + " " + momentNow.substring(11, 16),
      dia_result: "",
      primary_examiner: "",
      hospital_examiner: "",
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
      hospital_comments: "",
      asm: "",
      tug: "",
      walk_400m: ""
    }
    console.log(blankDiagnose);
    setDiagnose(blankDiagnose);
  }

  const setNewDiagnose = (selected_measurement: Measurement) => {

    // check SPPB score
    var sppb_score = "";
    if (
      selected_measurement.balanceA == "" ||
      selected_measurement.balanceB == "" ||
      selected_measurement.balanceC == "" ||
      selected_measurement.gait_speed4 == "" ||
      selected_measurement.chair_standup5 == "") {
      sppb_score = "";
    } else {
      var sppb_A = parseFloat(selected_measurement.balanceA);
      var sppb_B = parseFloat(selected_measurement.balanceB);
      var sppb_C = parseFloat(selected_measurement.balanceC);
      var gait4 = parseFloat(selected_measurement.gait_speed4);
      var standup5 = parseFloat(selected_measurement.chair_standup5);
      sppb_A = (sppb_A < 10) ? 0 : 1;
      sppb_B = (sppb_B < 10) ? 0 : 1;
      if (sppb_C < 3) {
        sppb_C = 0;
      } else if (sppb_C < 10) {
        sppb_C = 1;
      } else {
        sppb_C = 2;
      }

      if (selected_measurement.gait_speed4 == "-1") {
        gait4 = 0;
      } else {
        if (parseFloat(selected_measurement.gait_speed4) < 4.82) {
          gait4 = 4;
        } else if (parseFloat(selected_measurement.gait_speed4) < 6.20) {
          gait4 = 3;
        } else if (parseFloat(selected_measurement.gait_speed4) < 8.71) {
          gait4 = 2;
        } else {
          gait4 = 1;
        }
      }

      if (selected_measurement.chair_standup5 == "-1") {
        standup5 = 0;
      } else {
        if (parseFloat(selected_measurement.chair_standup5) < 11.2) {
          standup5 = 4;
        } else if (parseFloat(selected_measurement.chair_standup5) < 13.7) {
          standup5 = 3;
        } else if (parseFloat(selected_measurement.chair_standup5) < 16.7) {
          standup5 = 2;
        } else if (parseFloat(selected_measurement.chair_standup5) < 60.1) {
          standup5 = 1;
        } else {
          standup5 = 0;
        }
      }

      sppb_score = (sppb_A + sppb_B + sppb_C + gait4 + standup5).toString();

    }

    // setMeasurement(measurements[parseInt(item[0])]);
    setDiagnose({
      ...diagnose,
      calf_girth: selected_measurement.calf_girth,
      grip_strength: selected_measurement.grip_strength,
      chair_standup5: selected_measurement.chair_standup5,
      muscle_quantity: selected_measurement.muscle_quantity,
      gait_speed4: selected_measurement.gait_speed4,
      gait_speed6: selected_measurement.gait_speed6,
      balanceA: selected_measurement.balanceA,
      balanceB: selected_measurement.balanceB,
      balanceC: selected_measurement.balanceC,
      sppb_score: sppb_score,
      asm: selected_measurement.asm,
      tug: selected_measurement.tug,
      walk_400m: selected_measurement.walk_400m,
    })
  }

  const saveNewDiagnose = (diagType: string) => {
    if (diagnose.uid == "") {
      alert(t("select-a-diagnose"));
      return;
    }

    // const doc = new jsPDF('p', 'mm', [297, 210]); //default 72 ppi => pdf size 841 x 595
    const doc = new jsPDF('p', 'mm', [594, 420]); //default 72 ppi => pdf size 1683 x 1190 => print scale to A4 => 144ppi
    doc.setFontSize(16); //default font-size:16

    const saveFileName = user.name + "_" + diagnose.dia_datetime.substring(0, 10) + "_" + diagnose.dia_datetime.substring(11, 16) + ".pdf";

    if (diagType == "primary") {
      doc.addImage(awgs2019_primary_dataURL, 0, 0, 420, 594);
      doc.text("This is a test", 10, 10);
      doc.save("awgs_primary_" + saveFileName);
    } else if (diagType == "hospital") {
      doc.addImage(awgs2019_hospital_dataURL, 0, 0, 420, 594);
      doc.text("This is a test", 10, 10);
      doc.save("awgs_hospital_" + saveFileName);
    } else if (diagType == "ewgsop2") {
      doc.addImage(ewgsop2_dataURL, 0, 0, 420, 594);
      doc.text("This is a test", 10, 10);
      doc.save("ewgsop2_" + saveFileName);
    }
  }

  useEffect(() => {
    getUsers();
    getMeasurements();
    getDiagnoses();
    setDate(new Date());

    if (dia_standard == "AWGS 2019") {
      setAssessmentStandard("AWGS 2019");
    } else {
      setAssessmentStandard("EWGSOP2");
    }

    if (dia_type == "hospital") {
      setAssessmentType(t("hostpital-clinic"));
      setShowHospital(true);
    } else {
      setAssessmentType(t("primary-care"));
      setShowPrimary(true);
    }

  }, [])

  useEffect(() => {

    const diagnose_date = Date.parse(diagnose.dia_datetime);
    // @ts-ignore // 實在沒辦法，只好用粗暴的解法
    setDate(diagnose_date);

    // AWGS 2019 Primary screening
    (((user.gender == "male")
      ? ((parseFloat(diagnose.calf_girth) < 34.0) ? true : false)
      : ((parseFloat(diagnose.calf_girth) < 33.0) ? true : false))
      || (parseInt(diagnose.sarc_f_score) > 3)
      || (parseInt(diagnose.sarc_calf_score) > 10))
      ? setPrimaryScreeningPass(false) : setPrimaryScreeningPass(true);

    // AWGS 2019 Primary evaluate
    (((user.gender == "male")
      ? ((parseFloat(diagnose.grip_strength) < 28.0) ? true : false)
      : ((parseFloat(diagnose.grip_strength) < 18.0) ? true : false))
      || (parseFloat(diagnose.chair_standup5) > 12.0))
      ? setPrimaryEvaluatePass(false) : setPrimaryEvaluatePass(true);


    // AWGS 2019 Hospital Screening
    if (diagnose.clinicalIssues == "Y") {
      setClinicalIssues(true);
      setHospitalScreeningPass(false);
    }

    if (diagnose.clinicalIssues || !primaryScreeningPass) {
      setHospitalScreeningPass(false);
    }


    // AWGS 2019 Hospital evaluate
    const gripPass = ((user.gender == "male")
      ? ((parseFloat(diagnose.grip_strength) < 28.0) ? false : true)
      : ((parseFloat(diagnose.grip_strength) < 18.0) ? false : true))
    setHospitalGripPass(gripPass);

    const performancePass = !((parseFloat(diagnose.chair_standup5) > 12.0) ||
      (parseFloat(diagnose.gait_speed6) > 6.0) ||
      (parseInt(diagnose.sppb_score) < 10)
    );
    setHospitalPerformancePass(performancePass);

    const ASMIPass = ((user.gender == "male")
      ? ((parseFloat(diagnose.muscle_quantity) < 7.0) ? false : true)
      : ((parseFloat(diagnose.muscle_quantity) < 5.7) ? false : true));
    setHospitalASMIPass(ASMIPass);

    setHospitalEvaluatePass(gripPass && performancePass && ASMIPass);

    // EWGSOP2 evaluate

  }, [diagnose])

  useEffect(() => {
    // Clinical issue and hospital screening
    if (clinicalIssues) {
      setHospitalScreeningPass(false);
    } else {
      setHospitalScreeningPass(primaryScreeningPass);
    }
  }, [clinicalIssues])

  return (

    <div className="mt-12 flex flex-col w-full items-center justify-between ">

      <div className="flex flex-row w-8/12 items-center justify-between">

        <div className="flex flex-col space-y-1.5">

          <div className="flex flex-row ml-24 justify-between">
            <Label className="-ml-24 pt-1 text-2xl" htmlFor="diag_name">姓名：</Label>
            <Input className="text-xl border border-gray-500 w-[200px]"
              id="diag_name"
              value={user.name}
              onChange={
                (e) => {
                  setUser({ ...user, name: e.target.value });
                  setValidUser(false);
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
              placeholder={t('user-name')}
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
                            setValidUser(true);
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
              if (validUser) {
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
                  } ArrowDown
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
                          setClinicalIssues(false);
                          setDiagnose(diagnoses[parseInt(item[0])]);
                        }
                        setShowDiagnoseList(false);
                        setShowNewDiagnose(false);
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

                      if (dia_type == "hospital") {
                        setAssessmentType(t("hostpital-clinic"));
                        setShowPrimary(false);
                        setShowHospital(true);
                      } else {
                        setAssessmentType(t("primary-care"));
                        setShowPrimary(true);
                        setShowHospital(false);
                      }

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

        {(assessmentStandard == "AWGS 2019") && (
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
                        setAssessmentType(t("hostpital-clinic"));
                        setShowType(false);
                        setShowHospital(true);
                        setShowPrimary(false);
                      }
                    }
                  >
                    {t("hostpital-clinic")}
                  </li>
                </ul>
              </div>
            )}

          </div>
        )}

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

                      <div className=" bg-white">{t("dia-date")}：</div>
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
                            {date ? format(date, "yyyy-MM-dd") : <span>{t("select-date")}</span>}
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

                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("name")}：</div>
                        <div className="ml-4">{user.name = (validUser) ? user.name : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("age")}：</div>
                        <div className="ml-4">{user.age = (validUser) ? user.age : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("gender")}：</div>
                        <div className="ml-4">
                          {(validUser) ? (user.gender == "male" ? t("male") : t("female")) : ""}
                        </div>
                      </div>

                      <Button className="mt-4 bg-primary text-xl mt-12 z-10"
                        onClick={() => {
                          if (validUser) {
                            console.log(showNewDiagnose)
                            newDiagnose();
                            setShowNewDiagnose(!showNewDiagnose);
                          } else {
                            alert(t("select-a-user"))
                          }

                        }}
                      >
                        <Plus></Plus>{t("new-diagnose")}
                      </Button>

                      <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                      {showNewDiagnose && (
                        <div className="z-10 mt-2">
                          <div className="flex flex-col ">
                            <Button className="mt-1 border-gray-400 text-xl" variant={"outline"}
                              onClick={() => {
                                console.log("in sarc-f page 264:", measurements);
                                if (validUser) {
                                  if (showMeasurementList) {
                                    setShowMeasurementList(false);
                                    //setShowSearch(false);
                                    return;
                                  }

                                  let matched = 0;
                                  let toMatchedList: any = [];
                                  for (let i = 0; i < measurements.length; i++) {
                                    if (measurements[i].uid == user.id) {
                                      toMatchedList[matched] = [i.toString(), measurements[i].datetime];
                                      matched++;
                                    }
                                  }
                                  setMeasurementList(toMatchedList);
                                  if (matched == 0) {
                                    toMatchedList[matched] = ["0", t("no-mesaurement-data")];
                                  }

                                  setShowMeasurementList(true);
                                  setShowSearch(false);

                                } else {
                                  alert(t("select-a-user"));
                                }
                              }}
                            >
                              {t('measurement-records')}
                              <ArrowDown className="ml-2 h-6 w-6" />
                            </Button>
                            {showMeasurementList && (
                              <div className="">
                                <ul
                                  className="z-10 absolute w-[300px] py-2 px-8 bg-gray-200 
                                            border border-gray-200 rounded-md  ">
                                  {measurementList.map((item, index) => {
                                    return <li key={index}
                                      className={"py-2 cursor-pointer " + table_text_size}
                                      onClick={
                                        () => {
                                          if (item[1] != t("no-mesaurement-data")) {
                                            // const selected_measurement = measurements[parseInt(item[0])];
                                            setNewDiagnose(measurements[parseInt(item[0])]);
                                          }
                                          console.log("in sarc-f page 377:");
                                          setShowMeasurementList(false);
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

                        </div>
                      )}

                    </div>
                  </div>
                  {/* 基層篩檢 */}
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">{t("screening")}:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {
                            t("calf-girth") + ": " + t("male") + " < 34" + t("cm") +
                            ": " + t("female") + " < 33" + t("cm")
                          }
                        </div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.calf_girth) < 34) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.calf_girth) < 33) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >
                          {diagnose.calf_girth} {t("cm")}</div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">
                          {t("or") + " SARC-F" + " >= 4 " + t("points1")}
                        </div>
                        <div className={
                          ((parseInt(diagnose.sarc_f_score) > 3) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {((diagnose.sarc_f_score == "") ? "" : diagnose.sarc_f_score) + " " + t("points1")}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">
                          {t("or") + " SARC-CalF" + " >= 11 " + t("points1")}
                        </div>
                        <div className={
                          ((parseInt(diagnose.sarc_calf_score) > 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {((diagnose.sarc_calf_score == "") ? "" : diagnose.sarc_calf_score) + " " + t("points1")}
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
                      <div className="text-2xl font-bold mb-2">{t("assessments")}:</div>
                      <div className="text-xl font-bold ml-4">{t("muscle-strength")}:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {t("grip-strength") + ": " + t("male") + " < 28" + t("kgs") + ", " + t("female") + " < 18" + t("kgs")}
                        </div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.grip_strength) < 28) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.grip_strength) < 18) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.grip_strength} {t("kgs")}</div>
                      </div>
                      <div className="text-xl font-bold ml-4">{t("physical-performance")}:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {t("five-standups") + ": >= 12 " + t("seconds")}
                        </div>
                        <div className={
                          ((parseFloat(diagnose.chair_standup5) > 12.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.chair_standup5} {t("seconds")}</div>
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
                        <div className="text-2xl font-bold mb-2">{t("diagnose")}:
                          {(primaryEvaluatePass && primaryScreeningPass) && (
                            <span className="text-green-700"> {t("low-risk-sarc")}</span>
                          )}
                          {!(primaryEvaluatePass && primaryScreeningPass) && (
                            <span className="text-red-500">  {t("possible-sarc")}</span>
                          )}
                        </div>

                        <div className="flex flex-col mt-4">
                          <Button className="bg-primary text-white text-xl -mt-4 w-[120px]"
                            onClick={() => { alert("Demo mode not support"); }}
                          >
                            {t("save-new-diagnose")}
                          </Button>
                          <Button className="bg-primary text-white text-xl mt-2 w-[120px]"
                            onClick={() => {
                              alert("Demo mode not support");
                              //saveNewDiagnose("primary")
                            }}
                          >
                            {t("print-diagnose")}
                          </Button>
                        </div>

                      </div>

                      <div className="ml-16">
                        <div className="flex flex-row items-center justify-start">
                          1.
                          <div className="ml-2">{t("primary-diagnose")}</div></div>
                        <div>2. {t("consult-docter")}</div>
                      </div>



                      {(locale == "zh-tw") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-2/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, primary_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="mt-2">
                            {t("comments")}:
                          </div>

                          <Textarea className="ml-[82px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400"
                            id="description" value={diagnose.primary_comments}
                            onChange={(e) => {
                              setDiagnose({ ...diagnose, primary_comments: e.target.value });
                            }}
                          />
                        </>
                      )}

                      {(locale == "en") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-3/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12  border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, primary_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="flex flex-row items-start justify-start mt-4">
                            <div className="mt-2 w-3/12">
                              {t("comments")}:
                            </div>

                            <Textarea className=" w-10/12 h-[200px] text-xl border-gray-400"
                              id="description" value={diagnose.primary_comments}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, primary_comments: e.target.value });
                              }}
                            />
                          </div>
                        </>
                      )}


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

                      <div className=" bg-white">{t("dia-date")}：</div>
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
                            {date ? format(date, "yyyy-MM-dd") : <span>{t("select-date")}</span>}
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

                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("name")}：</div>
                        <div className="ml-4">{user.name = (validUser) ? user.name : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("age")}：</div>
                        <div className="ml-4">{user.age = (validUser) ? user.age : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("gender")}：</div>
                        <div className="ml-4">
                          {(validUser) ? (user.gender == "male" ? t("male") : t("female")) : ""}
                        </div>
                      </div>

                      <Button className="mt-4 bg-primary text-xl mt-12 z-10"
                        onClick={() => {
                          if (validUser) {
                            console.log(showNewDiagnose)
                            newDiagnose();
                            setShowNewDiagnose(!showNewDiagnose);
                          } else {
                            alert(t("select-a-user"))
                          }

                        }}
                      >
                        <Plus></Plus>{t("new-diagnose")}
                      </Button>

                      <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                      {showNewDiagnose && (
                        <div className="z-10 mt-2">
                          <div className="flex flex-col ">
                            <Button className="mt-1 border-gray-400 text-xl" variant={"outline"}
                              onClick={() => {
                                console.log("in sarc-f page 264:", measurements);
                                if (validUser) {
                                  if (showMeasurementList) {
                                    setShowMeasurementList(false);
                                    //setShowSearch(false);
                                    return;
                                  }

                                  let matched = 0;
                                  let toMatchedList: any = [];
                                  for (let i = 0; i < measurements.length; i++) {
                                    if (measurements[i].uid == user.id) {
                                      toMatchedList[matched] = [i.toString(), measurements[i].datetime];
                                      matched++;
                                    }
                                  }
                                  setMeasurementList(toMatchedList);
                                  if (matched == 0) {
                                    toMatchedList[matched] = ["0", t("no-mesaurement-data")];
                                  }

                                  setShowMeasurementList(true);
                                  setShowSearch(false);

                                } else {
                                  alert(t("select-a-user"));
                                }
                              }}
                            >
                              {t('measurement-records')}
                              <ArrowDown className="ml-2 h-6 w-6" />
                            </Button>
                            {showMeasurementList && (
                              <div className="">
                                <ul
                                  className="z-10 absolute w-[300px] py-2 px-8 bg-gray-200 border border-gray-200 rounded-md  ">
                                  {measurementList.map((item, index) => {
                                    return <li key={index}
                                      className={"py-2 cursor-pointer " + table_text_size}
                                      onClick={
                                        () => {
                                          if (item[1] != t("no-mesaurement-data")) {
                                            // const selected_measurement = measurements[parseInt(item[0])];
                                            setNewDiagnose(measurements[parseInt(item[0])]);
                                          }
                                          console.log("in sarc-f page 377:");
                                          setShowMeasurementList(false);
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

                        </div>
                      )}

                    </div>
                  </div>
                  {/* 醫院篩檢 */}
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">{t("screening")}:</div>
                      <div className="flex flex-row justify-start">
                        <input type="checkbox" className="mt-1 ml-4 w-4 h-4" checked={clinicalIssues}
                          onChange={(e) => {
                            if (validUser) {
                              setClinicalIssues(e.target.checked);
                            }
                          }}
                        />
                        <div className="text-xl font-bold mb-2 ml-4">{t("with-clinical-issues")}:</div>
                      </div>
                      <div className="text-xl mb-2 ml-4">
                        {t("with-hospital-issues-msg")}
                      </div>

                      <div className="w-11/12 h-[2px] bg-gray-400 m-4"> </div>

                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {
                            t("calf-girth") + ": " + t("male") + " < 34" + t("cm") +
                            ": " + t("female") + " < 33" + t("cm")
                          }
                        </div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.calf_girth) < 34) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.calf_girth) < 33) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >
                          {diagnose.calf_girth} {t("cm")}</div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">
                          {t("or") + " SARC-F" + " >= 4 " + t("points1")}
                        </div>
                        <div className={
                          ((parseInt(diagnose.sarc_f_score) > 3) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {((diagnose.sarc_f_score == "") ? "" : diagnose.sarc_f_score) + " " + t("points1")}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">
                          {t("or") + " SARC-CalF" + " >= 11 " + t("points1")}
                        </div>
                        <div className={
                          ((parseInt(diagnose.sarc_calf_score) > 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2 mt-1"}
                        >  {((diagnose.sarc_calf_score == "") ? "" : diagnose.sarc_calf_score) + " " + t("points1")}
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
                      <div className="text-2xl font-bold mb-2">{t("assessments")}:</div>
                      <div className="text-xl font-bold ml-4">{t("muscle-strength")}:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {t("grip-strength") + ": " + t("male") + " < 28" + t("kgs") + ", " + t("female") + " < 18" + t("kgs")}
                        </div>
                        <div className={((user.gender == "male")
                          ? (parseInt(diagnose.grip_strength) < 28) ? "bg-red-500" : "bg-green-700"
                          : (parseInt(diagnose.grip_strength) < 18) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.grip_strength} {t("kgs")}</div>
                      </div>
                      <div className="text-xl font-bold ml-4">{t("physical-performance")}:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">
                          {t("five-standups") + ": >= 12 " + t("seconds")}
                        </div>
                        <div className={
                          ((parseFloat(diagnose.chair_standup5) > 12.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.chair_standup5} {t("seconds")}</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{t("or") + t("gait_speed6_criteria")}</div>
                        <div className={
                          ((parseFloat(diagnose.gait_speed6) > 6.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.gait_speed6} {t("seconds")}</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{t("or") + t("sppb_criteria")}</div>
                        <div className={
                          ((parseInt(diagnose.sppb_score) < 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.sppb_score} {t("points1")}</div>
                      </div>

                      <div className="text-xl font-bold mt-2 ml-4">{t("muscle-quantity")}(ASMI): kg/m2</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-14">{"BIA： " + t("male") + " < 7.0 , " + t("female") + " < 5.7 "}</div>
                        <div className={
                          (
                            (user.gender == "male")
                              ? ((parseFloat(diagnose.muscle_quantity) < 7.0) ? "bg-red-500" : "bg-green-700")
                              : ((parseFloat(diagnose.muscle_quantity) < 5.7) ? "bg-red-500" : "bg-green-700")
                          )
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.muscle_quantity} <span className="text-sm ml-1 ">kg/m2</span></div>
                      </div>

                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>

                <img src={hospitalEvaluatePass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
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
                        <div className="text-2xl font-bold mb-2">{t("diagnose")}:
                          {(hospitalGripPass && hospitalASMIPass && hospitalPerformancePass) && (
                            <span className="text-green-700"> {t("low-risk-sarc")}</span>
                          )}

                          {(!hospitalGripPass && !hospitalASMIPass && !hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("severe-sarc")}</span>
                          )}

                          {(!hospitalGripPass && !hospitalASMIPass && hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("sarcpenia")}</span>
                          )}

                          {(hospitalGripPass && hospitalASMIPass && !hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("mild-sarc")}</span>
                          )}

                        </div>

                        <div className="flex flex-col mt-4">
                          <Button className="bg-primary text-white text-xl -mt-4 w-[120px]"
                            onClick={() => {
                              alert("Demo mode not support");
                            }}
                          >
                            {t("save-new-diagnose")}
                          </Button>
                          <Button className="bg-primary text-white text-xl mt-2 w-[120px]"
                            onClick={() => {
                              alert("Demo mode not support");
                              // saveNewDiagnose("hospital")
                            }}
                          >
                            {t("print-diagnose")}
                          </Button>
                        </div>

                      </div>

                      <div className="flex flex-row items-center justify-between">

                        <div className="ml-14 mt-1  text-2xl  font-bold text-red-500">
                          {clinicalIssues && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("has-clinical-issue-msg")}
                            </div>
                          )}

                          {!primaryScreeningPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("calf-or-sarc-low-msg")}
                            </div>
                          )}

                          {!hospitalGripPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-muscle-strength-msg")}
                            </div>
                          )}

                          {!hospitalASMIPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-muscle-quantity-msg")}
                            </div>
                          )}

                          {!hospitalPerformancePass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-phyical-performance")}
                            </div>
                          )}

                        </div>

                      </div>

                      {(locale == "zh-tw") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-2/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="mt-2">
                            {t("comments")}:
                          </div>

                          <Textarea className="ml-[82px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400"
                            id="description" value={diagnose.hospital_comments}
                            onChange={(e) => {
                              setDiagnose({ ...diagnose, hospital_comments: e.target.value });
                            }}
                          />
                        </>
                      )}

                      {(locale == "en") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-3/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12 border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="flex flex-row items-start justify-start mt-4">
                            <div className="mt-2 w-3/12">
                              {t("comments")}:
                            </div>

                            <Textarea className="w-10/12 h-[200px] text-xl border-gray-400"
                              id="description" value={diagnose.hospital_comments}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_comments: e.target.value });
                              }}
                            />
                          </div>
                        </>
                      )}

                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col h-full w-8/12 justify-evenly  rounded-2xl bg-white opacity-95">
        <div className="flex flex-row w-full items-center justify-center">
          {(assessmentStandard == "EWGSOP2") && (
            <div className="w-7/12 mt-4">
              {/* EWGSOP2 評估*/}
              <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
                <div className="flex flex-row items-start justify-center">
                  <div className="w-[300px] h-[190px] ml-[200px] text-xl rounded-2xl mt-3">
                    <div className="flex flex-col items-start justify-start p-4 ml-10">

                      <div className=" bg-white">{t("dia-date")}：</div>
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
                            {date ? format(date, "yyyy-MM-dd") : <span>{t("select-date")}</span>}
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

                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("name")}：</div>
                        <div className="ml-4">{user.name = (validUser) ? user.name : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("age")}：</div>
                        <div className="ml-4">{user.age = (validUser) ? user.age : ""}</div>
                      </div>
                      <div className="mt-4 bg-white w-[250px] flex flex-row">
                        <div className="w-[80px] ">{t("gender")}：</div>
                        <div className="ml-4">
                          {(validUser) ? (user.gender == "male" ? t("male") : t("female")) : ""}
                        </div>
                      </div>

                      <Button className="mt-4 bg-primary text-xl mt-12 z-10"
                        onClick={() => {
                          if (validUser) {
                            console.log(showNewDiagnose)
                            newDiagnose();
                            setShowNewDiagnose(!showNewDiagnose);
                          } else {
                            alert(t("select-a-user"))
                          }

                        }}
                      >
                        <Plus></Plus>{t("new-diagnose")}
                      </Button>

                      <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                      {showNewDiagnose && (
                        <div className="z-10 mt-2">
                          <div className="flex flex-col ">
                            <Button className="mt-1 border-gray-400 text-xl" variant={"outline"}
                              onClick={() => {
                                console.log("in sarc-f page 264:", measurements);
                                if (validUser) {
                                  if (showMeasurementList) {
                                    setShowMeasurementList(false);
                                    //setShowSearch(false);
                                    return;
                                  }

                                  let matched = 0;
                                  let toMatchedList: any = [];
                                  for (let i = 0; i < measurements.length; i++) {
                                    if (measurements[i].uid == user.id) {
                                      toMatchedList[matched] = [i.toString(), measurements[i].datetime];
                                      matched++;
                                    }
                                  }
                                  setMeasurementList(toMatchedList);
                                  if (matched == 0) {
                                    toMatchedList[matched] = ["0", t("no-mesaurement-data")];
                                  }

                                  setShowMeasurementList(true);
                                  setShowSearch(false);

                                } else {
                                  alert(t("select-a-user"));
                                }
                              }}
                            >
                              {t('measurement-records')}
                              <ArrowDown className="ml-2 h-6 w-6" />
                            </Button>
                            {showMeasurementList && (
                              <div className="">
                                <ul
                                  className="z-10 absolute w-[300px] py-2 px-8 bg-gray-200 border border-gray-200 rounded-md  ">
                                  {measurementList.map((item, index) => {
                                    return <li key={index}
                                      className={"py-2 cursor-pointer " + table_text_size}
                                      onClick={
                                        () => {
                                          if (item[1] != t("no-mesaurement-data")) {
                                            // const selected_measurement = measurements[parseInt(item[0])];
                                            setNewDiagnose(measurements[parseInt(item[0])]);
                                          }
                                          console.log("in sarc-f page 377:");
                                          setShowMeasurementList(false);
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

                        </div>
                      )}

                    </div>
                  </div>

                  <div className="w-[700px] flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="text-2xl font-bold mb-2">Assessment:</div>
                      <div className="text-xl font-bold ml-4">Low muscle strength:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="ml-8">{"Handgrip: Men < 27kg，Women < 16kg"}</div>
                        <div className={((user.gender == "male")
                          ? (parseFloat(diagnose.grip_strength) < 28.0) ? "bg-red-500" : "bg-green-700"
                          : (parseFloat(diagnose.grip_strength) < 18.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.grip_strength} kg</div>
                      </div>

                      <div className="flex flex-row items-center justify-between mt-2">
                        <div className="ml-8">{"Chair stand test (5 rises): > 15 seconds"}</div>
                        <div className={
                          ((parseFloat(diagnose.chair_standup5) > 15.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.chair_standup5} s</div>
                      </div>

                      <div className="text-xl font-bold mt-2 ml-4">Low muscle quantity:</div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="ml-8 mt-2">{"Appendicular Skeletal Muscle Mass(ASM):"}</div>
                          <div className="ml-14">{"Men < 20 kg，Women < 15 kg"}</div>
                        </div>
                        <div className={
                          (
                            (user.gender == "male")
                              ? ((parseFloat(diagnose.asm) < 20.0) ? "bg-red-500" : "bg-green-700")
                              : ((parseFloat(diagnose.asm) < 15.0) ? "bg-red-500" : "bg-green-700")
                          )
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >  {diagnose.asm} kg
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                          <div className="ml-8 mt-4 ">{"ASMI/height2:"}</div>
                          <div className="ml-14">{"Men < 7.0 kg/m2 ，Women < 5.5 kg/m2"}</div>
                        </div>
                        <div className={
                          (
                            (user.gender == "male")
                              ? ((parseFloat(diagnose.muscle_quantity) < 7.0) ? "bg-red-500" : "bg-green-700")
                              : ((parseFloat(diagnose.muscle_quantity) < 5.7) ? "bg-red-500" : "bg-green-700")
                          )
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >  {diagnose.muscle_quantity} <span className="text-sm ml-1 ">kg/m2</span>
                        </div>
                      </div>

                      <div className="text-xl font-bold mt-4 ml-4">Physical performance:</div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{"Gait speed (4m): > 3.2s (< 0.8 m/s)"}</div>
                        <div className={
                          ((parseFloat(diagnose.gait_speed6) > 6.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.gait_speed4} s</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{"Gait speed (6m): > 4.8s (< 0.8 m/s)"}</div>
                        <div className={
                          ((parseFloat(diagnose.gait_speed6) > 6.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.gait_speed6} s</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{"SPPB: <= 8 point score"}</div>
                        <div className={
                          ((parseInt(diagnose.sppb_score) < 10) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.sppb_score} points</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{"Timed-Up and G(TUG, 3m): >= 20s"}</div>
                        <div className={
                          ((parseFloat(diagnose.tug) > 20.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.tug} s</div>
                      </div>
                      <div className="flex flex-row mt-1 items-center justify-between">
                        <div className="ml-8">{"400m walk test: >= 6 min"}</div>
                        <div className={
                          ((parseFloat(diagnose.walk_400m) > 20.0) ? "bg-red-500" : "bg-green-700")
                          + " text-white p-1 rounded-md w-[120px]"
                          + " flex items-center justify-end pr-2"}
                        >{diagnose.walk_400m} s</div>
                      </div>

                    </div>
                  </div>
                  <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
                </div>

                <img src={hospitalEvaluatePass ? "/img/arrow-down-green.png" : "/img/arrow-down-red.png"}
                  className="h-[50px] w-[40px]">
                </img>

              </div>

              {/* EWGSOP2 診斷 */}
              <div className="flex flex-col w-full h-full mx-4 mb-8 items-center justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-[500px] h-[100px] text-xl">
                  </div>
                  <div className="w-[700px] flex flex-col items-center">
                    <div className="ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                      <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-bold mb-2">{t("diagnose")}:
                          {(hospitalGripPass && hospitalASMIPass && hospitalPerformancePass) && (
                            <span className="text-green-700"> {t("low-risk-sarc")}</span>
                          )}

                          {(!hospitalGripPass && !hospitalASMIPass && !hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("severe-sarc")}</span>
                          )}

                          {(!hospitalGripPass && !hospitalASMIPass && hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("sarcpenia")}</span>
                          )}

                          {(hospitalGripPass && hospitalASMIPass && !hospitalPerformancePass) && (
                            <span className="text-red-500"> {t("mild-sarc")}</span>
                          )}

                        </div>

                        <div className="flex flex-col mt-4">
                          <Button className="bg-primary text-white text-xl -mt-4 w-[120px]"
                            onClick={() => {
                              alert("Demo mode not support");
                            }}
                          >
                            {t("save-new-diagnose")}
                          </Button>
                          <Button className="bg-primary text-white text-xl mt-2 w-[120px]"
                            onClick={() => {
                              alert("Demo mode not support");
                              // saveNewDiagnose("ewgsop2")
                            }}
                          >
                            {t("print-diagnose")}
                          </Button>
                        </div>

                      </div>

                      <div className="flex flex-row items-center justify-between">

                        <div className="ml-14 mt-1  text-2xl  font-bold text-red-500">
                          {!hospitalGripPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-muscle-strength-msg")}
                            </div>
                          )}

                          {!hospitalASMIPass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-muscle-quantity-msg")}
                            </div>
                          )}

                          {!hospitalPerformancePass && (
                            <div className="flex flex-row items-center justify-start text-xl">
                              {t("low-phyical-performance")}
                            </div>
                          )}

                        </div>

                      </div>

                      {(locale == "zh-tw") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-2/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12 -ml-7 border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="mt-2">
                            {t("comments")}:
                          </div>

                          <Textarea className="ml-[82px] -mt-6 w-10/12 h-[200px] text-xl border-gray-400"
                            id="description" value={diagnose.hospital_comments}
                            onChange={(e) => {
                              setDiagnose({ ...diagnose, hospital_comments: e.target.value });
                            }}
                          />
                        </>
                      )}

                      {(locale == "en") && (
                        <>
                          <div className="flex flex-row items-center justify-start mt-4">
                            <Label className="text-xl w-3/12 font-normal" htmlFor="examiner">{t("diagnostician")}:</Label>
                            <Input className={table_text_size + " w-10/12 border-gray-400"}
                              id="examiner" placeholder={t("name")}
                              value={diagnose.primary_examiner}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_examiner: e.target.value });
                              }}
                            />
                          </div>

                          <div className="flex flex-row items-start justify-start mt-4">
                            <div className="mt-2 w-3/12">
                              {t("comments")}:
                            </div>

                            <Textarea className="w-10/12 h-[200px] text-xl border-gray-400"
                              id="description" value={diagnose.hospital_comments}
                              onChange={(e) => {
                                setDiagnose({ ...diagnose, hospital_comments: e.target.value });
                              }}
                            />
                          </div>
                        </>
                      )}

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