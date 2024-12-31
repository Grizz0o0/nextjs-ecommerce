import { HttpError } from '@/lib/http';
import { getExpireAt } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { accessToken, refreshToken, userId } = res;

        if (!accessToken || !refreshToken || !userId) {
            return Response.json(
                {
                    error: 'Access token, refresh token, and user ID are required.',
                },
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const accessExpireDate = getExpireAt(accessToken);
        if (!accessExpireDate || accessExpireDate.getTime() < Date.now()) {
            return Response.json(
                { error: 'Access token has expired.' },
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const accessExpiresDate = getExpireAt(accessToken)?.toUTCString();
        const refreshExpiresDate = getExpireAt(refreshToken)?.toUTCString();

        return Response.json(
            { message: 'Tokens set successfully.' },
            {
                status: 200,
                headers: {
                    'Set-Cookie': [
                        `accessToken=${accessToken}; Path=/; HttpOnly; Secure; Expires=${accessExpiresDate}; SameSite=Lax`,
                        `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; Expires=${refreshExpiresDate}; SameSite=Lax`,
                        `userId=${userId}; Path=/; HttpOnly; Secure; SameSite=Lax`,
                    ].join(', '),
                    'Content-Type': 'application/json',
                },
            }
        );
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
