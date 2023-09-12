import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("logout GET method");
  const response = NextResponse.json({
    message: "Login successful",
    success: true,
  })

  response.cookies.set("loginToken", '');
  return response;
}
