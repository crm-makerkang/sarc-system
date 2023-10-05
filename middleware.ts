import createMiddleware from 'next-intl/middleware';
import Cryptr from "cryptr";
import axios from 'axios';

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
// export default createMiddleware(
//   {
//     // A list of all locales that are supported
//     locales: ['en', 'ja', 'zh-tw', 'zh-cn'],

//     // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
//     defaultLocale: 'en'
//   }
// );

// export const config = {
//   // Skip all paths that should not be internationalized. This example skips the
//   // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };


// ref: https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs
//export default createMiddleware({ 
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  // locales: ['en', 'ja', 'zh-tw', 'zh-cn'],
  locales: ['en', 'ja', 'zh-tw'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('NEXT_LOCALE');
  let loginToken = request.cookies.get('loginToken')?.value || ''

  //console.log("in Middleware", cookie, request.nextUrl.pathname, loginToken);


  // request.nextUrl.href = 'http://localhost:8089/';
  // request.nextUrl.pathname = '/';
  // request.url = "/";
  const path = request.nextUrl.pathname;

  // const isProtected = path.includes("/measurements") || path.includes("/users");

  const isProtected = !path.includes("/login");
  // const isProtected = !isLoginUrl;

  console.log("in middleware 51:", path, "is protedted:", isProtected);

  // const isManagement = path.includes("/management");

  // console.log(path, "is management:", isManagement);

  if (loginToken) {
    // Error: The edge runtime does not support Node.js 'crypto' module. for both jwt and cryptr
    // axios doesn't support runtime, too. Use fetch instead

    const res = await fetch(`http://localhost:8089/api/token`, {
      method: 'POST',
      body: JSON.stringify({ loginToken: loginToken })
    })
    const response = await res.json();
    const loginTokenJSON = JSON.parse(response.message);
    console.log("in middleware 68:, privilege:", loginTokenJSON.privilege);

    console.log(loginTokenJSON.expireAT);
    if (new Date().getTime() > loginTokenJSON.expireAT) {
      console.log("Login token has expired");
      request.cookies.set('loginToken', '');
      loginToken = '';
    }

  }

  if (!isProtected) {
    if (loginToken) {
      return NextResponse.redirect(new URL('/guide', request.nextUrl))
    }
  }

  if (isProtected && !loginToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // if for next-intl paths, return the intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};