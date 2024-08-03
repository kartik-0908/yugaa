import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';


const isMemberRoute = createRouteMatcher(['/member(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);


export default clerkMiddleware((auth, req) => {

  const { sessionClaims } = auth()
  if (isMemberRoute(req) || isAdminRoute(req)) {
    auth().protect()
  }
  return middleware(
    req, sessionClaims
  );
});

async function middleware(request: NextRequest, sessionClaims: any) {
  if (request.nextUrl.pathname === '/integration') {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === '/') {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    if (shop) {
      return NextResponse.next();
    }
    else {
      if(!sessionClaims){
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
      else {
        if(!sessionClaims.metadata || !sessionClaims.metadata.role){
        return NextResponse.redirect(new URL('/permission-denied', request.url))
        }
        else if(sessionClaims.metadata.role === "admin"){
          return NextResponse.redirect(new URL('/admin/home', request.url))
        }
        else if(sessionClaims.metadata.role === "member"){
          return NextResponse.redirect(new URL('/member/inbox/unassigned', request.url))
        }
      }
    }
  }
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (sessionClaims.metadata.role === "member") {
      return NextResponse.redirect(new URL('/permission-denied', request.url))
    }
    else if(sessionClaims.metadata.role === "admin"){
      return NextResponse.next()
    }
  }
  else if (request.nextUrl.pathname.startsWith('/member')) {
    if (sessionClaims.metadata.role === "admin") {
      return NextResponse.redirect(new URL('/permission-denied', request.url))
    }
    else if(sessionClaims.metadata.role === "member"){
      return NextResponse.next()
    }
  }
  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};