import { decodeJWT } from '@/lib/utils';

type PayloadJWT = {
    userId: string;
    email: string;
    iat: number;
    exp: number;
};

export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.sessionToken as string;
    const userId = res.userId as string;
    if (!sessionToken || !userId) {
        return Response.json(
            { error: 'Missing access token or user ID' },
            { status: 400 }
        );
    }

    const payload = decodeJWT<PayloadJWT>(sessionToken);
    const expiresDate = new Date(payload.exp * 1000).toUTCString();
    return Response.json(res, {
        headers: {
            'Set-Cookie': [
                `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; Expires=${expiresDate}; SameSite=Lax`,
                `userId=${userId}; Path=/; HttpOnly; Secure;`,
            ].join(', '),
        },
    });
}
