import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";
import hash from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json()
    //console.log("in pwd_encrpty api 10:", reqBody);

    const encryptedString = hash(reqBody.username + process.env.TOKEN_SECRET!);
    //console.log("in pwd_encrpty api 13:", encryptedString.substring(0, 6));

    const response = NextResponse.json({
      message: encryptedString.substring(0, 6),
      success: true,
    })

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}