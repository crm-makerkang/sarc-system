import { NextRequest, NextResponse } from "next/server";
import { networkInterfaces } from "os"


export async function GET(request: NextRequest) {
  console.log("GET method");

  try {

    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    if (nets != undefined) {
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
          if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }
    }

    var ipaddress = "";

    // working on win10
    // for (var i = 0; i < Object.keys(results).length; i++) {
    //   if (Object.keys(results)[i].includes("Wi-Fi")) {
    //     ipaddress = results[Object.keys(results)[i]][0];
    //   }
    // }
    // working on win10

    // working on macbook
    console.log("get_ip api", results);
    for (var i = 0; i < Object.keys(results).length; i++) {
      if (results[Object.keys(results)[i]][0].includes("192")) {
        ipaddress = results[Object.keys(results)[i]][0];
      }
    }
    // working on macbook

    const response = NextResponse.json(ipaddress);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
