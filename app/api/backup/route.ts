import { NextRequest, NextResponse } from "next/server";
import * as child from 'child_process';
import os from 'os';
import fs from 'fs';
import axios from 'axios';

export async function GET(request: NextRequest) {
  console.log("Backup GET method");

  const nowTimeStamp = new Date().getTime();
  console.log("in backup api 14:", os.platform(), request.nextUrl.searchParams.get("cmd"), nowTimeStamp);

  if (request.nextUrl.searchParams.get("cmd") == "backup") {
    try {
      fs.copyFileSync("data/users.json", "data/users.json." + nowTimeStamp.toString());

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  const response = NextResponse.json("OK");
  return response;
}
