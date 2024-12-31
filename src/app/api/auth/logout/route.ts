import authApiRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { cookies } from 'next/headers';
export async function POST(request: Request) {
    const res = await request.json();
    const force = res.force as boolean | undefined;
    if (force) {
        return Response.json(
            {
                message: 'Your session has expired. Please log in again.',
            },
            {
                status: 200,
                headers: {
                    'Set-Cookie': [
                        `accessToken=; Path=/; HttpOnly; Secure; Max-Age=0`,
                        `refreshToken=; Path=/; HttpOnly; Secure; Max-Age=0`,
                        `userId=; Path=/; HttpOnly; Secure; Max-Age=0`,
                    ].join(', '),
                },
            }
        );
    }
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value || '';
    const refreshToken = cookieStore.get('refreshToken')?.value || '';
    const userId = cookieStore.get('userId')?.value || '';
    if (!accessToken || !refreshToken || !userId) {
        return Response.json(
            { error: 'Missing token or user ID' },
            { status: 401 }
        );
    }
    try {
        const result = await authApiRequest.logoutFromNextServerToServer(
            accessToken,
            userId
        );

        return Response.json(result.payload, {
            status: 200,
            headers: {
                'Set-Cookie': [
                    `accessToken=; Path=/; HttpOnly; Secure; Max-Age=0`,
                    `refreshToken=; Path=/; HttpOnly; Secure; Max-Age=0`,
                    `userId=; Path=/; HttpOnly; Secure; Max-Age=0`,
                ].join(', '),
            },
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.message, {
                status: error.status,
            });
        } else {
            return Response.json(
                { message: 'Lỗi không xác định' },
                { status: 500 }
            );
        }
    }
}
