import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up', '/auth/sign-in/forgot-password'];

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const { pathname } = request.nextUrl;

    // *CHECK ROUTE ZONE
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isPublicRoute && !token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (token && (pathname === '/auth/sign-in' || pathname === '/auth/sign-up')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
