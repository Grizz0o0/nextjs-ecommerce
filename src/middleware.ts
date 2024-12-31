import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authPaths = ['/login', '/register'];
const privatePaths = ['/me'];

export async function middleware(request: NextRequest) {
    const accessToken = await request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;

    if (
        privatePaths.some((path) => pathname.startsWith(path)) &&
        !accessToken
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
        return NextResponse.redirect(new URL('/me', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/register', '/me'],
};
