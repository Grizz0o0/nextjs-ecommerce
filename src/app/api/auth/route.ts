export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken: string | undefined =
        res.payload?.metadata?.tokens?.accessToken;
    if (!sessionToken) {
        return Response.json(
            { error: 'Missing access token' },
            { status: 400 }
        );
    }
    return Response.json(res.payload, {
        headers: {
            'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure;`,
        },
    });
}
