import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";
import hash from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json()
    const { username, password } = reqBody;
    console.log("aaa", reqBody);

    const encryptedString = hash(username + process.env.TOKEN_SECRET!);
    console.log("bbb", encryptedString.substring(0, 6));

    const validPassword = encryptedString.substring(0, 6) === reqBody.password

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

    //create token
    // const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

    const loginToken = cryptr.encrypt(JSON.stringify(loginTokenData));


    console.log("login api", privilege);
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