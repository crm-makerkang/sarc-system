import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import * as fs from "fs";

import { Measurement } from '@/types/types'
var measurements: Measurement[] = [];
var in_measuring: Measurement[] = [];
var dataToWrite: Measurement[] = [];
var fileToWrite = "";

import { json_in_measure_filename, json_measurements_filename } from '@/Settings/settings'

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

function readRecords() {
  measurements = [];
  try {
    var data = fs.readFileSync(json_measurements_filename, 'utf8');
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
  console.log("in userReport api 57:", in_measuring);
  fileToWrite = json_in_measure_filename;

  try {
    const post_data = await request.json();

    console.log("in userReport api 61:", post_data);

  } catch (error) {
    console.log("reqBody err");
    const response = NextResponse.json({
      message: "reqBody err",
      success: false,
    })


    return response;
  }

  return NextResponse.json("OK");

  // try {
  //   fs.writeFileSync(fileToWrite, JSON.stringify(dataToWrite));
  //   const response = NextResponse.json({
  //     message: "POST successful:",
  //     success: true,
  //   })
  //   return response;

  // } catch (error: any) {
  //   console.log(error.message);
  //   const response = NextResponse.json({
  //     message: error.message,
  //     success: false,
  //   })
  //   return response;
  // }



}
