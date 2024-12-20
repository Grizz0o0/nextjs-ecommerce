'use client';

import authApiRequest from '@/apiRequests/auth';
import { clientSessionToken } from '@/lib/http';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function Logout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionToken = searchParams.get('sessionToken');
    useEffect(() => {
        const handleLogout = async () => {
            if (sessionToken === clientSessionToken.value) {
                await authApiRequest.logoutFromNextClientToNextServer(true);
                router.push('/login');
            }
        };
        handleLogout();
    }, [router, sessionToken]);
    return <p>Logout</p>;
}

export default Logout;
