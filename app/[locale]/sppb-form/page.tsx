'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowDown, Check, X, Dot, Plus } from "lucide-react"
import { DateTime } from "luxon";
import { UserInfo, Measurement } from "@/types/types"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  //console.log("in Measurement page 50:", props);
  const t = useTranslations('sarc');
  const router = useRouter();

  const [locale, setLocale] = React.useState(props.params.locale);

  const [showSearch, setShowSearch] = React.useState(false);
  const [showMeasurementList, setShowMeasurementList] = React.useState(false);
  const [measurementList, setMeasurementList] = React.useState([["", ""]]);

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
    "calf_grith": "0",
    "grip_strength": "",
    "chair_standup5": "",
    "muscle_quantity": "",
    "gait_speed4": "",
    "gait_speed6": "",
    "balanceA": "",
    "balanceB": "",
    "balanceC": "",
    "uid": "",
    "rid": ""
  });

  const [vaildUser, setVaildUser] = React.useState(false);

  const [date, setDate] = React.useState<Date>(); // shadcn date picker

  const [sppb1A_points, setSppb1A_points] = React.useState("1");
  const [sppb1B_points, setSppb1B_points] = React.useState("1");
  const [sppb1C_points, setSppb1C_points] = React.useState("2");
  const [sppb1total_points, setSppb1total_points] = React.useState("4");
  const [sppb2_points, setSppb2_points] = React.useState("4");
  const [sppb3_points, setSppb3_points] = React.useState("4");
  const [sppb_points, setSppb_points] = React.useState("12");

  const [sppb1A_radio_diable, setSppb1A_radio_diable] = React.useState(false);
  const [sppb1B_radio_diable, setSppb1B_radio_diable] = React.useState(false);
  const [sppb1C_radio_diable, setSppb1C_radio_diable] = React.useState(false);
  const [sppb_2_radio_diable, setSppb_2_radio_diable] = React.useState(false);
  const [sppb_3_radio_diable, setSppb_3_radio_diable] = React.useState(false);

  const [sppb1A_radio_value, setSppb1A_radio_value] = React.useState("0");
  const [sppb1B_radio_value, setSppb1B_radio_value] = React.useState("0");
  const [sppb1C_radio_value, setSppb1C_radio_value] = React.useState("0");
  const [sppb_2_radio_value, setSppb_2_radio_value] = React.useState("0");
  const [sppb_3_radio_value, setSppb_3_radio_value] = React.useState("0");

  const [qcal_points, setQcal_points] = React.useState("0");
  const [sarc_calf_points, setSarc_calF_points] = React.useState("0");

  const getUsers = async () => {
    const res = await axios.get('/api/users/')
    //console.log(res.data);
    setUserData(res.data);
  }
  
  const getMeasurements = async () => {
    const res = await axios.get('/api/measurements/')
    console.log("in sppb page 115:", res.data);
    setMeasurements(res.data);
  }

  useEffect(() => {
    getUsers();
    getMeasurements();
    //const nowDateTime = DateTime.now().toString();
    setDate(new Date());
  }, [])

  useEffect(() => {
    const sppb1points= (parseInt(sppb1A_points) + parseInt(sppb1B_points) + parseInt(sppb1C_points));
    setSppb1total_points(
      sppb1points.toString()
    );

    setSppb_points((sppb1points + parseInt(sppb2_points) + parseInt(sppb3_points)).toString());
    
  }, [sppb1A_points, sppb1B_points, sppb1C_points, sppb2_points, sppb3_points])

  useEffect(() => {
    for (var i=0; i < userData.length; i++) {
      if (userData[i].id === measurement.uid) {
        if (measurement.balanceA != ""){
          setSppb1A_radio_diable(true);
          setSppb1A_radio_value((parseFloat(measurement.balanceA) < 10.0) ? "1" : "0");
          setSppb1A_points((parseFloat(measurement.balanceA) < 10.0) ? "0" : "1");
        } 

        if (measurement.balanceB != ""){      
          setSppb1B_radio_diable(true);
          setSppb1B_radio_value((parseFloat(measurement.balanceB) < 10.0) ? "1" : "0");            
          setSppb1B_points( (parseFloat(measurement.balanceB) < 10.0) ? "0" : "1");
        }

        if (measurement.balanceC != ""){
          setSppb1C_radio_diable(true);

          if (parseFloat(measurement.balanceC)<3.0){
            setSppb1C_radio_value("2");
            setSppb1C_points("0");
          } else if (parseFloat(measurement.balanceC)< 10.0){
            setSppb1C_radio_value("1");
            setSppb1C_points("1");
          } else {
            setSppb1C_radio_value("0");
            setSppb1C_points("2");
          }
        }

        if (measurement.chair_standup5=="not-completed") {
          setSppb2_points("0");
        } else {
          if (parseFloat(measurement.chair_standup5) < 4.82) {
            setSppb2_points("4");
          } else if (parseFloat(measurement.chair_standup5) < 6.20) {
            setSppb2_points("3");
          } else if (parseFloat(measurement.chair_standup5) < 8.70) {
            setSppb2_points("2");
          } else {
            setSppb2_points("1");
          } 
        }
        
        if (measurement.gait_speed4=="not-completed") {
          setSppb3_points("0");
        } else {
          if (parseFloat(measurement.gait_speed4) < 11.2) {
            setSppb3_points("4");
          } else if (parseFloat(measurement.gait_speed4) < 13.7) {
            setSppb3_points("3");
          } else if (parseFloat(measurement.gait_speed4) < 16.7) {
            setSppb3_points("2");
          } else if (parseFloat(measurement.gait_speed4) < 60.0) {
            setSppb3_points("1");
          } else {
            setSppb3_points("0");
          }
        }        
        break;
      }
    }
  }, [measurement])

  return (

    <div className="mt-12 flex flex-col w-full items-center justify-start ">

      <div className="flex flex-row w-8/12 items-center justify-between">

        <div className="flex flex-row w-4/12 items-center justify-start">
          <div className="flex flex-col space-y-1.5">
            <div className="flex flex-row">
              <Label className="pt-1 text-2xl">{t("name")}：</Label>
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
                              setVaildUser(true);
                              break;
                            }
                          }

                          setShowSearch(false);
                          setShowMeasurementList(false);
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

        </div>
        <div className="w-4/12 text-3xl font-bold">{t("sppb-full")}</div>

        <div className="w-2/12"></div>

      </div>

      <div className="flex flex-col h-full w-8/12 justify-evenly mt-4 mb-4 rounded-2xl bg-white opacity-95">
        <div className="flex flex-row w-full items-center justify-center">
          <div className="w-7/12 mt-4">
            {/* SPPB */}
            <div className="flex flex-col w-full h-full mx-4 items-center justify-center">
              <div className="flex flex-row items-start justify-center">
                <div className="w-[300px] h-[190px] ml-[200px] text-xl rounded-2xl mt-3">
                  <div className="flex flex-col items-start justify-start p-4 ml-10">

                    <div className=" bg-white">{t("date-questionnaire")}：</div>
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

                    <div className="mt-4 bg-white w-[250px] flex flex-row">
                      <div className="w-[80px] ">{t("name")}：</div>
                      <div className="ml-4">{user.name = (vaildUser) ? user.name : ""}</div>
                    </div>
                    <div className="mt-4 bg-white w-[250px] flex flex-row">
                      <div className="w-[80px] ">{t("age")}：</div>
                      <div className="ml-4">{user.age = (vaildUser) ? user.age : ""}</div>
                    </div>
                    <div className="mt-4 bg-white w-[250px] flex flex-row">
                      <div className="w-[80px] ">{t("gender")}：</div>
                      <div className="ml-4">
                        {(vaildUser) ? (user.gender == "male" ? t("male") : t("female")) : ""}
                      </div>
                    </div>

                    {vaildUser && (
                      <>
                        <div className="w-full h-[2px] mt-2 bg-gray-400"></div>

                        {/* <div className="mt-4 bg-white">{t("new-questionnaire")}：</div> */}

                        <div className="text-lg mt-4 w-[200px]">{t("get-calf-grith-from-measurement-or-input")}</div>

                        <div className="flex flex-col ">
                          <Button className="mt-1 border-gray-400 text-xl" variant={"outline"}
                            onClick={() => {
                              console.log("in sarc-f page 264:", measurements);
                              if (vaildUser) {
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
                                          setMeasurement(measurements[parseInt(item[0])]);
                                        }
                                        console.log("in sarc-f page 377:", measurements[parseInt(item[0])]);
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

                      </>
                    )}

                  </div>
                </div>
                {/* SPPB Form */}
                <div className="w-[700px] flex flex-col items-center">
                  <div className="mt-4 ml-4 p-4 border-2 border-gray-400 w-full text-xl rounded-2xl">
                    <div className="text-xl font-bold mb-2">{t("sppb-balance-desc")}</div>

                    <div className="text-xl ml-4  ">{t("sppb-balance-a")}</div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center text-xl mt-2 ml-8 w-[320px] ">
                        <img src="/img/sppb_A.png" className="w-[50px] h-[50px]"/>
                        <div className="w-[120px] text-right border border-gray-400 ml-4 p-2 rounded-md">
                          {measurement.balanceA} {t("seconds")}
                        </div>
                      </div>

                      <RadioGroup value={sppb1A_radio_value} disabled={sppb1A_radio_diable}
                        className="w-[300px]"                      
                        onValueChange={(e) => {
                          switch (e) {
                            case "0":
                              setSppb1A_radio_value("0")
                              setSppb1A_points("1");
                              break;
                            case "1":
                              setSppb1A_radio_value("1")
                              setSppb1A_points("0");
                              break;
                            default:
                              break;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className="text-lg" >{t("keep-10s")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className="text-lg">{t("less-10s")}</Label>
                        </div>
                      </RadioGroup>

                      <Label className="text-xl text-right border border-gray-500 w-[100px] p-1 pr-2 rounded-md">
                        {sppb1A_points}
                      </Label>
                    </div>

                    <div className="text-xl ml-4 mt-8 -mb-8">{t("sppb-balance-b")}</div>                    
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center text-xl mt-10 ml-8 w-[320px] ">
                        <img src="/img/sppb_B.png" className="w-[50px] h-[70px]"/>
                        <div className="w-[120px] text-right border border-gray-400 ml-4 p-2 rounded-md">
                          {measurement.balanceB} {t("seconds")}
                        </div>                          
                      </div>

                      <RadioGroup value={sppb1B_radio_value} disabled={sppb1B_radio_diable}
                        className="w-[300px]"                      
                        onValueChange={(e) => {
                          switch (e) {
                            case "0":
                              setSppb1B_radio_value("0")
                              setSppb1B_points("1");
                              break;
                            case "1":
                              setSppb1B_radio_value("1")
                              setSppb1B_points("0");
                              break;
                            default:
                              break;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className="text-lg" >{t("keep-10s")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className="text-lg">{t("less-10s")}</Label>
                        </div>
                      </RadioGroup>

                      <Label className="text-xl text-right border border-gray-500 w-[100px] p-1 pr-2 rounded-md">
                        {sppb1B_points}
                      </Label>
                    </div>

                    <div className="text-xl ml-4 mt-8 -mb-8">{t("sppb-balance-c")}</div>                    
                    <div className="flex flex-row items-center justify-between">                     
                      <div className="flex flex-row items-center text-xl mt-10 ml-12 w-[320px] ">
                        <img src="/img/sppb_C.png" className="w-[30px] h-[80px]"/>
                        <div className="w-[120px] text-right border border-gray-400 ml-5 p-2 rounded-md">
                          {measurement.balanceC} {t("seconds")}
                        </div>                          
                      </div>

                      <RadioGroup value={sppb1C_radio_value} disabled={sppb1C_radio_diable}
                        className="w-[320px]"                      
                        onValueChange={(e) => {
                          switch (e) {
                            case "0":
                              setSppb1C_radio_value("0");
                              setSppb1C_points("2");
                              break;
                            case "1":
                              setSppb1C_radio_value("1");
                              setSppb1C_points("1");
                              break;
                            case "2":
                              setSppb1C_radio_value("2");
                              setSppb1C_points("0");
                              break;
                            default:
                              break;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className="text-lg" >{t("c-keep-10s")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className="text-lg">{t("c-more-3s")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" />
                          <Label className="text-lg">{t("c-less-3s")}</Label>
                        </div>
                      </RadioGroup>

                      <Label className="text-xl text-right border border-gray-500 w-[100px] p-1 pr-2 rounded-md">
                        {sppb1C_points}
                      </Label>
                    </div>

                    <div className="flex flex-row items-center justify-end">
                      <div className="flex flex-col">
                        <div className="text-xl font-bold mt-6 ">
                          {t("sum")} :
                        </div>                      
                      </div>
                      <Label className="text-xl text-right w-[80px] mt-6 ml-2 p-1 pr-2 border border-gray-400 rounded-md " 
                      >
                        {sppb1total_points}
                      </Label>
                    </div>                    

                    <div className="h-[2px] w-full mt-4 bg-gray-400"></div>

                    <div className="text-xl font-bold ml-4 mt-8 -mb-8">{t("sppb-standup-desc")}</div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xl mt-6 ml-8 w-[320px] ">
                        <div className="w-[120px] text-right border border-gray-400  p-2 rounded-md">
                          {measurement.chair_standup5} {t("seconds")}
                        </div>                         
                      </div>                        

                      <RadioGroup defaultValue={sppb_2_radio_value} disabled={sppb_2_radio_diable}
                        className="mt-12 w-[300px]"                      
                        onValueChange={(e) => {
                          switch (e) {
                            case "0":
                              setSppb2_points("4");
                              break;
                            case "1":
                              setSppb2_points("3");
                              break;
                            case "2":
                              setSppb2_points("2");
                            break;
                            case "3":
                              setSppb2_points("1");
                              break;
                            case "4":
                              setSppb2_points("0");
                              break;                                                              
                            default:
                              break;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className="text-lg" >{"< 4.82 "+t("seconds")+"=4"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className="text-lg">{"4.82 ~ 6.20 "+t("seconds")+"=3"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" />
                          <Label className="text-lg">{"6.21 ~ 8.70 "+t("seconds")+"=2"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" />
                          <Label className="text-lg">{"> 8.70 "+t("seconds")+"=1"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4" />
                          <Label className="text-lg">{t("unable-to-complete")}</Label>
                        </div>                                                
                      </RadioGroup>

                      <Label className="text-xl text-right border border-gray-500 w-[100px] p-1 pr-2 rounded-md">
                        {sppb2_points}
                      </Label>
                    </div>

                    <div className="h-[2px] w-full mt-4 bg-gray-400"></div>

                    <div className="text-xl font-bold ml-4 mt-8 -mb-8">{t("sppb-walk-desc")}</div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xl mt-6 ml-8 w-[320px]">
                        <div className="w-[120px] text-right border border-gray-400  p-2 rounded-md">
                          {measurement.gait_speed4} {t("seconds")}
                        </div>                        
                      </div>  

                      <RadioGroup defaultValue={sppb_3_radio_value} disabled={sppb_3_radio_diable}
                        className="mt-12 w-[300px]"
                        onValueChange={(e) => {
                          switch (e) {
                            case "0":
                              setSppb3_points("4");
                              break;
                            case "1":
                              setSppb3_points("3");
                              break;
                            case "2":
                              setSppb3_points("2");
                              break;
                            case "3":
                              setSppb3_points("1");
                              break;
                            case "4":
                              setSppb3_points("0");
                              break;                              
                            default:
                              break;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className="text-lg" >{"< 11.19 "+t("seconds")+"=4"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className="text-lg">{"11.2 ~ 13.69 "+t("seconds")+"=3"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" />
                          <Label className="text-lg">{"13.7 ~ 16.69 "+t("seconds")+"=2"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" />
                          <Label className="text-lg">{"16.7 ~ 59.9 "+t("seconds")+"=1"}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4" />
                          <Label className="text-lg">{"> 60 "+t("seconds")+"/"+t("unable-to-complete")}</Label>
                        </div>                        
                      </RadioGroup>

                      <Label className="text-xl text-right border border-gray-500 w-[100px] p-1 pr-2 rounded-md">
                        {sppb3_points}
                      </Label>
                    </div> 

                    <div className="h-[2px] w-full mt-4 bg-gray-400"></div>

                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col">
                        <div className="text-xl font-bold mt-6 w-[550px] text-justify ">
                         {t("sppb-score-desc")}
                        </div>                      
                      </div>
                      <Label className={"text-xl text-right w-[90px] mt-6 p-1 pr-2 rounded-md text-white " +
                                        (parseInt(sppb_points) > 9 ? "bg-green-700" : "bg-red-500")}
                      >
                        {sppb_points}
                      </Label>
                    </div> 

                  </div>
                </div>
                <div className="w-[550px] h-[100px] p-2 rounded-2xl"></div>
              </div>

            </div>

            <div className="flex flex-row items-center justify-between mt-4 mb-12 ">
              <div className="">
                <Button variant="outline" className="text-xl border-gray-400"
                  onClick={() => window.location.reload()}
                >
                  {t("clear-data")}
                </Button>
              </div>

              <div className="">
                <Button className="text-xl bg-primary">
                  {t("save-sppb")}
                </Button>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div >

  );
}