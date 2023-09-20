import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";

var loginData = {
  username: "",
  privilege: 0
};
export async function GET(request: NextRequest) {
  console.log("in token api 9", loginData);
  const response = NextResponse.json(loginData);
  return response;
}

export async function POST(request: NextRequest) {
  console.log("in token api 15:", "token POST");

  try {
    let loginTokenString = "";
    try {
      const reqBody = await request.json()
      const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
      loginTokenString = cryptr.decrypt(reqBody.loginToken);
      console.log("in token api 23:", JSON.parse(loginTokenString));
      loginData = JSON.parse(loginTokenString);

    } catch (error) {
      console.log("get_token POST reqBody err");
    }

    const response = NextResponse.json({
      message: loginTokenString, //"POST successful:",
      success: true,
    })

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}