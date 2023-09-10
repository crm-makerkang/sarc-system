import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

import { UserInfo } from '@/types/types'
var users: UserInfo[] = []

import { json_settings_filename } from '@/Settings/settings'

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

  let settings = readSettings();

  const response = settings == "Error" 
    ? NextResponse.json({
      message: "GET: settings file read failed!",
      success: false,
    }) 
    : NextResponse.json({
      message: settings,
      success: true,
    })

  return response;

}

export async function POST(request: NextRequest) {
  console.log("POST Mewthod");

  let settings = readSettings();

    try {
      const reqBody = await request.json()

      console.log(reqBody.table_text_size, reqBody.row_per_page);

      //用來找 settings 中參數的位置 console.log(settings.search("8"));

      const font_size =(settings.substring(32,39));
      const row_per_page = settings.substring(72,74);

      if (reqBody.table_text_size) {
        console.log("prev:",font_size, "\t new:", reqBody.table_text_size);
        settings = settings.replace(font_size, reqBody.table_text_size);
      }

      if (reqBody.row_per_page) {
        console.log("prev:",row_per_page, "\t new:", reqBody.row_per_page);
        settings = settings.replace(row_per_page, reqBody.row_per_page);
      }
      console.log(settings);


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