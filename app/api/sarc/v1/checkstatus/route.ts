import { NextRequest, NextResponse } from "next/server";
import { networkInterfaces } from "os"


export async function GET(request: NextRequest) {
  console.log("api checkstatus GET method");

  return NextResponse.json("OK");

}
