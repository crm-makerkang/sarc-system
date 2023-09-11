import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function hash(input: string): string {
  var hash = 0,
    i, chr;
  if (input.length === 0) return hash.toString(16);
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  if (hash < 0) {
    hash = Math.abs(hash);
  }
  return hash.toString(16);
}

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json()
    const { username, password } = reqBody;
    console.log("aaa", reqBody);

    const encryptedString = hash(username + process.env.TOKEN_SECRET!);

    const validPassword = encryptedString.substring(0, 6) === reqBody.password
    console.log("ccc", encryptedString.substring(0, 6));
    console.log("bbb", validPassword);

    if (!validPassword) {
      return NextResponse.json({
        message: "Incorrect password",
        success: false,
      })
    }

    //create token data
    const tokenData = {
      username: username,
    }
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    })

    response.cookies.set("token", token, {
      httpOnly: true,

    })
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}