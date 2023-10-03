import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import * as fs from "fs";

import { Measurement, Diagonose } from '@/types/types'
var diagnoses: Diagonose[] = [];
var dataToWrite: Measurement[] = [];
var fileToWrite = "";

import { json_in_measure_filename, json_measurements_filename, json_diagnoses_filename } from '@/Settings/settings'

function readDiagnoses() {
  try {
    var data = fs.readFileSync(json_diagnoses_filename, 'utf8');
    try {
      const diagnoses = JSON.parse(data);
      return diagnoses;
    } catch (error: any) {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

function readMeasuring() {
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
  console.log("diagnoses api GET method");

  console.log("diagnoses api 66:");

  try {
    diagnoses = readDiagnoses();
    console.log("Records number:", diagnoses.length);
    const response = NextResponse.json(diagnoses);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("measurements POST Mewthod");

  if (request.nextUrl.searchParams.get("cmd") == "writeToRecords") {
    dataToWrite = readRecords();
    fileToWrite = json_measurements_filename;

    try {
      const reqBody = await request.json();
      const record_uuid = uuidv4();
      const nowDateTime = DateTime.now().toString();

      reqBody.rid = record_uuid;
      reqBody.datetime = nowDateTime!.substr(0, 10) + " " + nowDateTime!.substr(11, 5);
      dataToWrite.push(reqBody);

      console.log("in measurements api 81:", reqBody, dataToWrite.length, dataToWrite);

    } catch (error) {
      console.log("reqBody err");
      const response = NextResponse.json({
        message: "reqBody err",
        success: false,
      })
      return response;
    }

    try {
      fs.writeFileSync(fileToWrite, JSON.stringify(dataToWrite));
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

  } else if (request.nextUrl.searchParams.get("cmd") == "writeToMeasuring") {
    // dataToWrite = readMeasuring();
    fileToWrite = json_in_measure_filename;

    try {
      dataToWrite = await request.json();

      console.log("in measurements api 116:", dataToWrite, dataToWrite.length);

    } catch (error) {
      console.log("reqBody err");
      const response = NextResponse.json({
        message: "reqBody err",
        success: false,
      })
      return response;
    }

    try {
      fs.writeFileSync(fileToWrite, JSON.stringify(dataToWrite));
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


  } else {
    return NextResponse.json({
      message: "cmd incorrected",
      success: false,
    })
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