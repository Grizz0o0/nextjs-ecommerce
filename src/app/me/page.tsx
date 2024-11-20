import envConfig from '@/config';
import { cookies } from 'next/headers';
import Profile from './profile';

async function MyProfile() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken');
    try {
        const result = await fetch(
            `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/v1/api/shop/me`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    'x-client-id': envConfig.NEXT_PUBLIC_X_CLIENT_ID,
                    authorization: `${sessionToken?.value}`,
                },
                method: 'GET',
            }
        ).then(async (res) => {
            const payload = await res.json();
            const data = {
                status: res.status,
                payload,
            };
            if (!res.ok) {
                throw data;
            }
            return data;
        });
        console.log(result);

        return (
            <div className="">
                <h1>Hello {result?.payload?.metadata?.name}</h1>
                <Profile />
            </div>
        );
    } catch (error) {
        console.log(error);
    }
}

export default MyProfile;
