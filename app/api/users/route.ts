import { createCheckboxScope } from "@radix-ui/react-checkbox";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

type userInfo = {
  uuid: string,
  user: {
    name: string,
    email: string,
    gender: string,
    age: number,
    phone: string
  }
}
var users: userInfo[] = []

function readUsers() {
  try {
    var data = fs.readFileSync('Output.txt', 'utf8');
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
      users.push({ "uuid": user_uuid, "user": reqBody });
      console.log(users.length);

    } catch (error) {
      console.log("reqBody err");
    }

    try {
      fs.writeFileSync('Output.txt', JSON.stringify(users))
    } catch (error: any) {
      console.log(error.message);
    }

    // try { //appendFile 無法新增 object element
    //   fs.appendFileSync('Output.txt', user)
    // } catch (error: any) {
    //   console.log(error.message);
    // }

    const response = NextResponse.json({
      message: "POST successful:",
      success: true,
    })

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}