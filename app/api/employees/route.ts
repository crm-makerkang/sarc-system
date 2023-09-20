import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import { json_employees_filename } from '@/Settings/settings'

function readEmployees() {
  try {
    var data = fs.readFileSync(json_employees_filename, 'utf8');
    try {
      const employees = JSON.parse(data);
      console.log("in employee api 14:", employees)
      return employees;
    } catch (error: any) {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

var employees = [];
export async function GET(request: NextRequest) {
  console.log("Employees GET method");

  try {
    employees = readEmployees();
    console.log("Employees number:", employees.length);
    const response = NextResponse.json(employees);
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("Employees POST Mewthod");

  employees = [];

  try {
    employees = readEmployees();

    try {
      const reqBody = await request.json();


      employees.push(reqBody.name);
      console.log(employees.length, employees);

    } catch (error) {
      console.log("reqBody err");
    }

    try {
      fs.writeFileSync(json_employees_filename, JSON.stringify(employees))
    } catch (error: any) {
      console.log(error.message);
    }

    const response = NextResponse.json({
      message: "POST successful:",
      success: true,
    })

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}