import authApiRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { getExpireAt } from '@/lib/utils';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken');
        const userId = cookieStore.get('userId');
        if (!refreshToken || !userId) {
            return Response.json(
                {
                    error: 'Refresh token or userId are required.',
                },
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const res = await authApiRequest.slideTokenNextServerToServer(
            refreshToken.value,
            userId.value
        );

        const newAccessToken = res.payload.metadata.tokens.accessToken;
        const newRefreshToken = res.payload.metadata.tokens.refreshToken;

        const payloadNewAccessToken = getExpireAt(newAccessToken);
        const payloadNewRefreshToken = getExpireAt(newRefreshToken);

        const newAccessTokenExp = payloadNewAccessToken
            ? payloadNewAccessToken.toUTCString()
            : '';
        const newRefreshTokenExp = payloadNewRefreshToken
            ? payloadNewRefreshToken.toUTCString()
            : '';

        return Response.json(
            { message: 'Tokens set successfully.' },
            {
                status: 200,
                headers: {
                    'Set-Cookie': [
                        `accessToken=${newAccessToken}; Path=/; HttpOnly; Secure; Expires=${newAccessTokenExp}; SameSite=Lax`,
                        `refreshToken=${newRefreshToken}; Path=/; HttpOnly; Secure; Expires=${newRefreshTokenExp}; SameSite=Lax`,
                        `userId=${userId.value}; Path=/; HttpOnly; Secure; SameSite=Lax`,
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
