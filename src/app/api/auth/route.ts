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
    return Response.json(res, {
        headers: {
            'Set-Cookie': [
                `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure;`,
                `userId=${userId}; Path=/; HttpOnly; Secure;`,
            ].join(', '),
        },
    });
}
