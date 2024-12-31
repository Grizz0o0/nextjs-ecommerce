'use client';
import { useEffect, useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { AccountResType } from '@/schemaValidations/account.schema';
import { clientToken } from '@/lib/http';

function Profile() {
    const [profileData, setProfileData] = useState<AccountResType>();
    useEffect(() => {
        const fetchRequest = async () => {
            const result = await accountApiRequest.me(
                clientToken.accessToken,
                clientToken.userId
            );
            setProfileData(result.payload);
        };
        fetchRequest();
    }, []);
    return (
        <div>
            <h2>Profile</h2>
            <p>name {profileData?.metadata.name}</p>
            <p>email {profileData?.metadata.email}</p>
            <p>rules {profileData?.metadata.rules}</p>
        </div>
    );
}

export default Profile;
