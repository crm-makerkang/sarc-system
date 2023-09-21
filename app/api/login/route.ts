import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";
import hash from "@/lib/hash";
import axios from "axios";

export async function POST(request: NextRequest) {

  try {

    const reqBody = await request.json()
    const { username, password } = reqBody;

    // check if employee name is exist in the list
    // axios.get and fetch all working with http://.... 
    // const res = await fetch('http://localhost:8089/api/employees/')
    const res = await axios.get('http://localhost:8089/api/employees/')
    console.log("in login api 18:", res.data);
    if (!res.data.includes(username) && username != "admin") {
      const response = NextResponse.json({
        message: "emplyee name is not found",
        success: false,
      })
      return response;
    }

    const encryptedString = hash(username + process.env.TOKEN_SECRET! + (username == "admin" ? "admin" : ""));
    console.log("in login api 20:", encryptedString.substring(0, 6));

    const validPassword = encryptedString.substring(0, 6) === password

    if (!validPassword) {
      return NextResponse.json({
        message: "Incorrect password",
        success: false,
      })
    }

    //create token data
    const privilege = (username == "admin") ? 100 : 1;
    const loginTokenData = {
      username: username,
      privilege: privilege,
      expireAT: new Date().getTime() + 1000 * 60 * 60 * 23  // 1hr
    }
    const cryptr = new Cryptr(process.env.TOKEN_SECRET!);

    const loginToken = cryptr.encrypt(JSON.stringify(loginTokenData));

    console.log("login api 42:", privilege);
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    })

    response.cookies.set("loginToken", loginToken, {
      httpOnly: true,

    })
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}