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

export async function GET(request: NextRequest) {
  console.log("diagnoses api GET method");

  console.log("diagnoses api 66:");

  try {
    diagnoses = readDiagnoses();
    console.log("Records number:", diagnoses.length);
    const response = NextResponse.json(diagnoses);
    return response;

  } catch (error: any) {
    return NextResponse.json("Failed");
  }
}

export async function POST(request: NextRequest) {
  console.log("measurements POST Mewthod");

  if (request.nextUrl.searchParams.get("cmd") == "writeToDiagnoses") {
    dataToWrite = readDiagnoses();
    fileToWrite = json_diagnoses_filename;

    try {
      const reqBody = await request.json();
      const diagnose_uuid = uuidv4();
      const nowDateTime = DateTime.now().toString();

      reqBody.dia_id = diagnose_uuid;
      reqBody.dia_datetime = nowDateTime!.substr(0, 10) + " " + nowDateTime!.substr(11, 5);
      dataToWrite.push(reqBody);

      console.log("in diagnose_uuid api 77", reqBody, dataToWrite.length, dataToWrite);

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
        message: "diagnoses POST successful 75:",
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
  console.log("diagnose DELETE Method");

  try {
    diagnoses = readDiagnoses();
    console.log("Diagnose number:", diagnoses.length);

    try {
      const reqBody = await request.json();
      console.log("in diagnoses api 122:", reqBody);

      for (var i = 0; i < diagnoses.length; i++) {
        console.log("in diagnoses api 125:", reqBody.dia_id);
        for (var j = 0; j < reqBody.id.length; j++) {
          if (diagnoses[i].dia_id === reqBody.dia_id[j]) {
            diagnoses.splice(i, 1);
          }
        }
      }
    } catch (error) {
      console.log("reqBody err");
      const response = NextResponse.json({
        message: "reqBody err",
        success: false,
      })
      return response;
    }

    try {
      fs.writeFileSync(json_diagnoses_filename, JSON.stringify(diagnoses))
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