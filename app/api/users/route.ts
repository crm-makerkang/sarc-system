import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

import { UserInfo } from '@/types/types'
var users: UserInfo[] = []
var cryptedUsers: string[] = [];
var encrypted_users: any[] = [];

import { json_users_filename } from '@/Settings/settings'

function readUsers() {
  const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
  users = [];
  try {
    var data = fs.readFileSync(json_users_filename, 'utf8');
    try {
      encrypted_users = JSON.parse(data);
      for (var i = 0; i < encrypted_users.length; i++) {
        users.push(JSON.parse(cryptr.decrypt(encrypted_users[i])));
      }
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
  console.log("users api GET method");

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
  console.log("users POST Mewthod");
  const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
  users = [];

  try {
    users = readUsers();

    try {
      const reqBody = await request.json();
      const user_uuid = uuidv4();

      reqBody.id = user_uuid;
      users.push(reqBody);
      console.log(users.length);

    } catch (error) {
      console.log("reqBody err");
    }

    try {

      for (var i = 0; i < users.length; i++) {
        cryptedUsers[i] = cryptr.encrypt(JSON.stringify(users[i]));
      }

      fs.writeFileSync(json_users_filename, JSON.stringify(cryptedUsers))
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

export async function DELETE(request: NextRequest) {
  console.log("users DELETE Method");
  const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
  users = [];

  try {
    users = readUsers();

    try {
      const reqBody = await request.json();
      console.log("in users api 101:", reqBody);
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === reqBody.id) {
          console.log("in users api 104: index", i);
          encrypted_users.splice(i, 1);
          break;
        }
      }
    } catch (error) {
      console.log("reqBody err");
    }

    try {
      fs.writeFileSync(json_users_filename, JSON.stringify(encrypted_users))
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