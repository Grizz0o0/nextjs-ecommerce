'use client';

import { useState } from 'react';
import { clientToken } from '@/lib/http';
import { isClient } from '@/lib/utils';

export default function AppProvider({
    children,
    initialAccessToken = '',
    initialRefreshToken = '',
    initialUserId = '',
}: {
    children: React.ReactNode;
    initialAccessToken?: string;
    initialRefreshToken?: string;
    initialUserId?: string;
}) {
    useState(() => {
        if (isClient()) {
            clientToken.accessToken = initialAccessToken;
            clientToken.refreshToken = initialRefreshToken;
            clientToken.userId = initialUserId;
        }
    });

    return <>{children}</>;
}
