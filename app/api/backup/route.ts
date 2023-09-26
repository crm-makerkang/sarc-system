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

  if (request.nextUrl.searchParams.get("cmd") == "backupUsers") {
    try {
      fs.copyFileSync("data/users.json", "data/users.json." + nowTimeStamp.toString());

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  if (request.nextUrl.searchParams.get("cmd") == "recoverUsers") {
    try {
      const recoveryFile = request.nextUrl.searchParams.get("file")
      console.log("in backup api 54:", recoveryFile);
      if ((recoveryFile != null) && (recoveryFile != "")) {
        fs.copyFileSync("data/" + recoveryFile, "data/users.json");
      }

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  const response = NextResponse.json("OK");
  return response;
}
