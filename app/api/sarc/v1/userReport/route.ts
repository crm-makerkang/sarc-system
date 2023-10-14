import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import * as fs from "fs";

import { Measurement } from '@/types/types'
var measurements: Measurement[] = [];
var in_measuring: Measurement[] = [];
var dataToWrite: Measurement[] = [];
var fileToWrite = "";

import { json_in_measure_filename } from '@/Settings/settings'

function readMeasuring() {
  measurements = [];
  try {
    var data = fs.readFileSync(json_in_measure_filename, 'utf8');
    try {
      const in_measuring = JSON.parse(data);
      return in_measuring;
    } catch (error: any) {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function GET(request: NextRequest) {
  console.log("userReport api GET method");

  return NextResponse.json("OK");
}

export async function POST(request: NextRequest) {
  console.log("userReport POST Mewthod");


  in_measuring = readMeasuring();
  fileToWrite = json_in_measure_filename;

  var post_data;
  try {
    post_data = await request.json();

    console.log("in userReport api 61:", post_data);

  } catch (error) {
    console.log("reqBody err");
    const response = NextResponse.json({
      message: "reqBody err",
      success: false,
    })
    return response;
  }

  var in_measure_index = -1;
  for (var i = 0; i < in_measuring.length; i++) {
    if (in_measuring[i].uid == post_data.data.userId) {
      in_measure_index = i;
      break;
    }
  }

  console.log("in_measure_index", in_measure_index);

  if (in_measure_index == -1) { // not in_measuring found, new in_measure
    var new_in_measure: Measurement = {
      "datetime": "",
      "name": "",
      "calf_grith": "",
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
    };
    new_in_measure.uid = post_data.data.userId;
    in_measuring.push(new_in_measure);
    in_measure_index = in_measuring.length - 1;
  }

  console.log("in api userReport 90:", post_data.data.reportNum);

  switch (post_data.data.reportNum) {
    case "a1":
      in_measuring[in_measure_index].muscle_quantity =
        (post_data.data.report.SkipTest) ? "" : post_data.data.report.Value.toString();
      break;
    case "a2":
      in_measuring[in_measure_index].balanceA =
        (post_data.data.report.SkipTest_A) ? "" : post_data.data.report.Value1.toString();
      in_measuring[in_measure_index].balanceB =
        (post_data.data.report.SkipTest_B) ? "" : post_data.data.report.Value2.toString();
      in_measuring[in_measure_index].balanceC =
        (post_data.data.report.SkipTest_C) ? "" : post_data.data.report.Value3.toString();
      break;
    case "a3":
      const MaxPowerRight = (post_data.data.report.SkipTest_Right) ? "0" : post_data.data.report.MaxPowerRight;
      const MaxPowerLeft = (post_data.data.report.SkipTest_Left) ? "0" : post_data.data.report.MaxPowerLeft;
      const MaxPower = (parseFloat(MaxPowerRight) > parseFloat(MaxPowerLeft)) ? MaxPowerRight : MaxPowerLeft;

      in_measuring[in_measure_index].grip_strength = (MaxPower == 0) ? "" : MaxPower.toString();
      break;
    case "a4":
      in_measuring[in_measure_index].chair_standup5 =
        (post_data.data.report.SkipTest) ? "" : post_data.data.report.Value.toString();
      break;
    case "a5":
      if (post_data.data.report.type == "4M") {
        in_measuring[in_measure_index].gait_speed4 =
          (post_data.data.report.SkipTest) ? "" : post_data.data.report.Value.toString();
      } else if (post_data.data.report.type == "6M") {
        in_measuring[in_measure_index].gait_speed6 =
          (post_data.data.report.SkipTest) ? "" : post_data.data.report.Value.toString();
      } else {
        return NextResponse.json("error: a5 report should have type 4M or 6M");
      }
      break;
    case "a6":
      in_measuring[in_measure_index].calf_grith =
        (post_data.data.report.SkipTest) ? "" : post_data.data.report.Value.toString();
      break;
    default:
      return NextResponse.json("error: reportNum is not found");
  }

  console.log("in api userReport 102:", in_measuring[in_measure_index]);

  try {
    fs.writeFileSync(fileToWrite, JSON.stringify(in_measuring));
    return NextResponse.json("OK");

  } catch (error: any) {
    console.log(error.message);
    const response = NextResponse.json({
      message: error.message,
      success: false,
    })
    return response;
  }
}
