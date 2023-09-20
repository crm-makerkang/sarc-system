import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  console.log("logout GET method");

  // clear token 以下 npm run build 會有問題
  //await axios.get('http://localhost:8089/api/token/?clear=1');

  const response = NextResponse.json({
    message: "Logot successful",
    success: true,
  })

  response.cookies.set("loginToken", '');
  return response;
}
