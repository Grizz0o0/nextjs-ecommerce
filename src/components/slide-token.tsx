'use client';

import authApiRequest from '@/apiRequests/auth';
import { useEffect } from 'react';
import { differenceInHours } from 'date-fns';
import { getExpireAt } from '@/lib/utils';
export default function SlideSession({ accessToken }: { accessToken: string }) {
    const expireAt = getExpireAt(accessToken);
    const accessTokenExp = expireAt ? expireAt.toUTCString() : '';
    const expiresAt = new Date(accessTokenExp);

    const slideToken = async () => {
        const now = new Date();
        if (differenceInHours(expiresAt, now) < 1) {
            console.log(`Token is about to expire. Sliding token...`);
            await authApiRequest.slideTokenNextClientToNextServer();
        }
    };

    useEffect(() => {
        slideToken();
        const interval = setInterval(slideToken, 1000 * 60 * 30); // 30 phút
        return () => clearInterval(interval);
    }, []);

    return null;
}
