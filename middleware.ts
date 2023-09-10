import createMiddleware from 'next-intl/middleware';

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
  locales: ['en', 'ja', 'zh-tw', 'zh-cn'],
 
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});

export function middleware (request: NextRequest){
  const cookie = request.cookies.get('NEXT_LOCALE');
  const token = request.cookies.get('token')?.value || ''

  console.log("in Middleware", cookie, request.nextUrl.pathname);

  // request.nextUrl.href = 'http://localhost:3000/';
  // request.nextUrl.pathname = '/';
  // request.url = "/";
  const path = request.nextUrl.pathname;

  const isProtected = path.includes("/measurements") || path.includes("/users");
  console.log(path, "is protedted:", isProtected);

  // if (isProtected && !token) {
  //   return NextResponse.redirect(new URL('/', request.nextUrl))
  // }

  // if for next-intl paths, return the intl middleware
  return intlMiddleware(request);
}
 
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};