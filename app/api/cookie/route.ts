import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("cookie POST");
  try {
    try {
      const reqBody = await request.json()

      console.log(reqBody.locale);
      const response = NextResponse.json({
        message: "POST successful:",
        success: true,
      })

      response.cookies.set("NEXT_LOCALE", reqBody.locale);
      return response;

    } catch (error) {
      console.log("cookie POST reqBody err");
      return NextResponse.json({
        message: "ookie POST reqBody err",
        success: false,
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}