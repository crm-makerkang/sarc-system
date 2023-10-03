import { NextRequest, NextResponse } from "next/server";
import * as child from 'child_process';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import { DateTime } from 'luxon'

var userFileList: string[] = [];
var measurementsFileList: string[] = [];

function getFileLists() {
  userFileList = [];
  measurementsFileList = [];

  fs.readdirSync("data").forEach(file => {
    if (file.includes("users")) userFileList.push(file);
    if (file.includes("measurements")) measurementsFileList.push(file);
  })

}

export async function GET(request: NextRequest) {
  console.log("Backup GET method");

  const nowTimeStamp = new Date().getTime();

  console.log("in backup api 14:", os.platform(), request.nextUrl.searchParams.get("cmd"), nowTimeStamp);

  getFileLists();

  if (request.nextUrl.searchParams.get("cmd") == "getFileList") {
    console.log("in backup api 30:", userFileList, measurementsFileList);

    const response = NextResponse.json(
      {
        userFileList: userFileList,
        measurementsFileList: measurementsFileList
      }
    );
    return response;

  }

  if (request.nextUrl.searchParams.get("cmd") == "backupDatabase") {
    try {
      console.log("in backup api 46:");
      fs.copyFileSync("data/users.json", "data/users.json." + nowTimeStamp.toString());
      fs.copyFileSync("data/measurements.json", "data/measurements.json." + nowTimeStamp.toString());
      fs.copyFileSync("data/diagnoses.json", "data/diagnoses.json." + nowTimeStamp.toString());
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      // return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json("Failed");
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "recoverDatabase") {
    try {
      const recoveryFile = request.nextUrl.searchParams.get("file")
      console.log("in backup api 59:", recoveryFile);
      if ((recoveryFile != null) && (recoveryFile != "")) {
        fs.copyFileSync("data/users.json." + recoveryFile, "data/users.json");
        fs.copyFileSync("data/diagnoses.json." + recoveryFile, "data/diagnoses.json");
        fs.copyFileSync("data/measurements.json." + recoveryFile, "data/measurements.json");
      }
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      console.log("in backup api 68:", error.message);
      // return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json("Failed");
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "delteDatabaseBackup") {
    try {
      const deleteFile = request.nextUrl.searchParams.get("file")
      console.log("in backup api 78:", deleteFile);
      if ((deleteFile != null) && (deleteFile != "")) {
        fs.unlinkSync("data/users.json." + deleteFile);
        fs.unlinkSync("data/diagnoses.json." + deleteFile);
        fs.unlinkSync("data/measurements.json." + deleteFile);
      }
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      console.log("in backup api 87:", error.message);
      // return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json("Faild");
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "deleteAllBackups") {
    try {

      //fs.unlinkSync("data/" + deleteFile);
      const path = 'data/'
      // let regex = /users.json.[0-9]*/
      let regex = /.json.[0-9]*/
      fs.readdirSync(path)
        .filter(f => regex.test(f))
        // .map(f => console.log(path + f))
        .map(f => fs.unlinkSync(path + f))

      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }


  if (request.nextUrl.searchParams.get("cmd") == "backupMeasurements") {
    try {
      fs.copyFileSync("data/measurements.json", "data/measurements.json." + nowTimeStamp.toString());
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "recoverMeasurements") {
    try {
      const recoveryFile = request.nextUrl.searchParams.get("file")
      console.log("in backup api 54:", recoveryFile);
      if ((recoveryFile != null) && (recoveryFile != "")) {
        fs.copyFileSync("data/" + recoveryFile, "data/measurements.json");
      }
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "deleteMeasurementsBackup") {
    try {
      const deleteFile = request.nextUrl.searchParams.get("file")
      console.log("in backup api 71:", deleteFile);
      if ((deleteFile != null) && (deleteFile != "")) {
        fs.unlinkSync("data/" + deleteFile);
      }
      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "deleteAllMeasurementsBackups") {
    try {

      //fs.unlinkSync("data/" + deleteFile);
      const path = 'data/'
      let regex = /measurements.json.[0-9]*/
      fs.readdirSync(path)
        .filter(f => regex.test(f))
        // .map(f => console.log(path + f))
        .map(f => fs.unlinkSync(path + f))

      const response = NextResponse.json("OK");
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }


  const response = NextResponse.json("OK");
  return response;
}
