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
  console.log("sarc api getUserInfoGET method");

  const card_no = request.nextUrl.searchParams.get("card");
  console.log("card_no:", card_no);

  if (card_no == null) {
    return NextResponse.json("error: card is not specified");
  }


  try {
    users = readUsers();
    console.log("Records number:", users.length);

    for (var i = 0; i < users.length; i++) {
      if (users[i].card_no == card_no) {
        return NextResponse.json(users[i]);
      }
    }

    return NextResponse.json("error: card is not found");

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
