import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";

export async function POST(request: NextRequest) {
  console.log("get_token POST");
  try {
    let loginTokenString = "";
    try {
      const reqBody = await request.json()
      const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
      loginTokenString = cryptr.decrypt(reqBody.loginToken);

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