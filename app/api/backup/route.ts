import { NextRequest, NextResponse } from "next/server";
import * as child from 'child_process';
import os from 'os';
import axios from 'axios';

export async function GET(request: NextRequest) {
  console.log("Backup GET method");
  console.log("in backup api 7:", os.platform());

  try {
    child.exec("ls -al data", (error, stdout, stderr) => {
      if (error) {
        console.log(`in backup api 13: error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`in backup api 17: stderr: ${stderr}`);
        return;
      }
      console.log(`in backup api 20: stdout: ${stdout}`);
    })

    const response = NextResponse.json("OK");
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
