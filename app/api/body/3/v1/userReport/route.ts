import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

import { UserInfo } from '@/types/types'
var users: UserInfo[] = []

import { json_users_filename } from '@/Settings/settings'

function readUsers() {
  try {
    var data = fs.readFileSync(json_users_filename, 'utf8');
    //console.log(data);
    try {
      users = JSON.parse(data);
      return users;
    } catch (error: any) {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function GET(request: NextRequest) {
  console.log("GET method");
  //console.log("api",process.env.DOMAIN);

  try {
    users = readUsers();
    console.log("Records number:", users.length);
    const response = NextResponse.json(users);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("POST Mewthod");
  try {
    users = readUsers();

    try {
      const reqBody = await request.json()

      const user_uuid = uuidv4()
      // users.push({ "uuid": user_uuid, "user": reqBody });

      reqBody.uuid = user_uuid;
      users.push(reqBody);
      console.log(users.length);

    } catch (error) {
      console.log("reqBody err");
    }

    try {
      fs.writeFileSync(json_users_filename, JSON.stringify(users))
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