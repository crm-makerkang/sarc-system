import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

import { UserInfo } from '@/types/types'
var users: UserInfo[] = []

import { json_settings_filename } from '@/Settings/settings'

let globalSettings = "";

function readSettings() {
  try {
    var data = fs.readFileSync(json_settings_filename, 'utf8');
    return data;
  } catch (error) {
    console.log("read setting file err");
    return "Error"
  }
}

export async function GET(request: NextRequest) {
  console.log("GET method");

  if (globalSettings == "") {
    console.log("globalSettings is empty");
    let settings = readSettings();

    if (settings == "Error") {
      return NextResponse.json({
        message: "GET: settings file read failed!",
        success: false,
      })
    } else {
      const font_size = settings.substring(32, 39);
      const rows_per_page = settings.substring(70, 72);
      globalSettings = JSON.stringify({ "table_text_size": font_size, "rows_per_page": rows_per_page });
    }
  }

  return NextResponse.json({
    message: globalSettings,
    success: true,
  })

}

export async function POST(request: NextRequest) {
  console.log("POST Mewthod");

  let settings = readSettings();

  try {
    const reqBody = await request.json()

    console.log(reqBody.table_text_size, reqBody.rows_per_page);

    //用來找 settings 中參數的位置 console.log(settings.search("8"));

    const font_size = settings.substring(32, 39);
    const rows_per_page = settings.substring(70, 72);

    if (reqBody.table_text_size) {
      console.log("prev:", font_size, "\t new:", reqBody.table_text_size);
      settings = settings.replace(font_size, reqBody.table_text_size);
    }

    if (reqBody.rows_per_page) {
      console.log("prev:", rows_per_page, "\t new:", reqBody.rows_per_page);
      settings = settings.replace(rows_per_page, reqBody.rows_per_page);
    }
    console.log(settings);

    globalSettings = JSON.stringify({
      "table_text_size": reqBody.table_text_size ? reqBody.table_text_size : font_size,
      "rows_per_page": reqBody.rows_per_page ? reqBody.rows_per_page : rows_per_page
    });
    console.log(globalSettings);



  } catch (error) {
    console.log("reqBody err");
  }

  try {
    fs.writeFileSync(json_settings_filename, settings)
  } catch (error: any) {
    console.log(error.message);
  }

  const response = NextResponse.json({
    message: "POST successful:",
    success: true,
  })

  return response;
}