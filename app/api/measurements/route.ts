import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

import { Measuements } from '@/types/types'
var measuements: Measuements[] = []
var cryptedMeasurements: string[] = [];

import { json_measurements_filename } from '@/Settings/settings'

function readMeasurements() {
  const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
  measuements = [];
  try {
    var data = fs.readFileSync(json_measurements_filename, 'utf8');
    try {
      const encrypted_measuements = JSON.parse(data);
      for (var i = 0; i < encrypted_measuements.length; i++) {
        measuements.push(JSON.parse(cryptr.decrypt(encrypted_measuements[i])));
      }
      return measuements;
    } catch (error: any) {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function GET(request: NextRequest) {
  console.log("measuements api GET method");

  try {
    measuements = readMeasurements();
    console.log("Records number:", measuements.length);
    const response = NextResponse.json(measuements);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("measuements POST Mewthod");
  const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
  measuements = [];

  try {
    measuements = readMeasurements();

    try {
      const reqBody = await request.json();
      const user_uuid = uuidv4();

      reqBody.id = user_uuid;
      measuements.push(reqBody);
      console.log(measuements.length);

    } catch (error) {
      console.log("reqBody err");
    }

    try {

      for (var i = 0; i < measuements.length; i++) {
        cryptedMeasurements[i] = cryptr.encrypt(JSON.stringify(measuements[i]));
      }

      fs.writeFileSync(json_measurements_filename, JSON.stringify(cryptedMeasurements))
    } catch (error: any) {
      console.log(error.message);
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