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
                        `sessionToken=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                        `userId=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                    ].join(', '),
                },
            }
        );
    }
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value || '';
    const userId = cookieStore.get('userId')?.value || '';
    if (!sessionToken || !userId) {
        return Response.json(
            { error: 'Missing access token or user ID' },
            { status: 401 }
        );
    }
    try {
        const result = await authApiRequest.logoutFromNextServerToServer(
            sessionToken,
            userId
        );

        return Response.json(result.payload, {
            status: 200,
            headers: {
                'Set-Cookie': [
                    `sessionToken=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                    `userId=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
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
