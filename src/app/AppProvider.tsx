'use client';

import { useState } from 'react';
import { clientSessionToken } from '@/lib/http';
import { isClient } from '@/lib/utils';

export default function AppProvider({
    children,
    initialSessionToken = '',
    initialUserId = '',
}: {
    children: React.ReactNode;
    initialSessionToken?: string;
    initialUserId?: string;
}) {
    useState(() => {
        if (isClient()) {
            clientSessionToken.value = initialSessionToken;
            clientSessionToken.user = initialUserId;
        }
    });

    return <>{children}</>;
}
