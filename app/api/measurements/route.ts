import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import * as fs from "fs";

import { Measurement } from '@/types/types'
var measurements: Measurement[] = []
var cryptedMeasurements: string[] = [];

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
  console.log("measurements api GET method");

  console.log("measurement api 47:", request.nextUrl.searchParams.get("type"));

  const isMeasuring = request.nextUrl.searchParams.get("type") == "measuring";

  try {
    measurements = isMeasuring ? readMeasuring() : readRecords();
    console.log("Records number:", measurements.length);
    const response = NextResponse.json(measurements);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("measurements POST Mewthod");

  try {
    measurements = readRecords();

    try {
      const reqBody = await request.json();
      const record_uuid = uuidv4();
      const nowDateTime = DateTime.now().toString();

      reqBody.rid = record_uuid;
      reqBody.datetime = nowDateTime!.substr(0, 10) + " " + nowDateTime!.substr(11, 5);
      measurements.push(reqBody);

      console.log("in measurements api 76:", reqBody, measurements.length, measurements);

    } catch (error) {
      console.log("reqBody err");
      const response = NextResponse.json({
        message: "reqBody err",
        success: false,
      })
      return response;
    }


    try {
      fs.writeFileSync(json_measurements_filename, JSON.stringify(measurements))
    } catch (error: any) {
      console.log(error.message);
      const response = NextResponse.json({
        message: error.message,
        success: false,
      })
      return response;
    }

    const response = NextResponse.json({
      message: "POST successful:",
      success: true,
    })

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  console.log("measurements DELETE Method");

  const isMeasuring = request.nextUrl.searchParams.get("type") == "measuring";

  try {
    measurements = isMeasuring ? readMeasuring() : readRecords();
    console.log("Records number:", measurements.length);

    try {
      const reqBody = await request.json();
      console.log("in management api 117:", reqBody);

      if (isMeasuring) {
        // reqBody.id is the index array
        for (var i = (reqBody.id.length - 1); i > -1; i--) {
          console.log("in management api 122:", reqBody.id[i]);
          measurements.splice(reqBody.id, 1);
        }
      } else {

        for (var i = 0; i < measurements.length; i++) {
          console.log("in management api 128:", reqBody.id);
          for (var j = 0; j < reqBody.id.length; j++) {
            if (measurements[i].rid === reqBody.id[j]) {
              measurements.splice(i, 1);
            }
          }
        }
      }

      // console.log("in management api 136:", measurements.length, measurements);
    } catch (error) {
      console.log("reqBody err");
      const response = NextResponse.json({
        message: "reqBody err",
        success: false,
      })
      return response;
    }

    try {
      const measurementFileName = isMeasuring ? json_in_measure_filename : json_measurements_filename
      fs.writeFileSync(measurementFileName, JSON.stringify(measurements))
    } catch (error: any) {
      console.log(error.message);
      const response = NextResponse.json({
        message: error.message,
        success: false,
      })
      return response;
    }

    const response = NextResponse.json({
      message: "POST successful:",
      success: true,
    })

    return response;

  } catch (error: any) {
    console.log(error.message);
    const response = NextResponse.json({
      message: error.message,
      success: false,
    })
    return response;
  }
}