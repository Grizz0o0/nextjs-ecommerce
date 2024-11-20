import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPath = ['/login', '/register'];
const privatePath = ['/me'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('sessionToken');
    console.log(sessionToken?.value); // => { name: 'nextjs', value: 'fast', Path: '/' }
    const { pathname } = request.nextUrl;
    console.log(pathname);

    if (
        privatePath.some((path) => pathname.startsWith(path)) &&
        !sessionToken
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (publicPath.some((path) => pathname.startsWith(path)) && sessionToken) {
        return NextResponse.redirect(new URL('/me', request.url));
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/register', '/me'],
};
