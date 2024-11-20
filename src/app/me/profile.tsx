'use client';
import envConfig from '@/config';
import { useEffect } from 'react';
import { useAppContext } from '../AppProvider';

function Profile() {
    const { sessionToken } = useAppContext();
    useEffect(() => {
        const fetchRequest = async () => {
            const result = await fetch(
                `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/v1/api/shop/me`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                        'x-client-id': envConfig.NEXT_PUBLIC_X_CLIENT_ID,
                        authorization: `${sessionToken}`,
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
        };
        fetchRequest();
    }, [sessionToken]);
    return <div>Profile</div>;
}

export default Profile;
