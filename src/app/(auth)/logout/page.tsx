'use client';

import authApiRequest from '@/apiRequests/auth';
import { clientToken } from '@/lib/http';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function Logout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const accessToken = searchParams.get('accessToken');
    useEffect(() => {
        const handleLogout = async () => {
            if (accessToken === clientToken.accessToken) {
                await authApiRequest.logoutFromNextClientToNextServer(true);
                router.push('/login');
            }
        };
        handleLogout();
    }, [router, accessToken]);
    return <p>Logout</p>;
}

export default Logout;
