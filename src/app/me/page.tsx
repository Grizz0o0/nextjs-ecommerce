import { cookies } from 'next/headers';
import Profile from './profile';
import accountApiRequest from '@/apiRequests/account';
import { handleMappedError } from '@/lib/utils';
import { HttpError } from '@/lib/http';

async function MyProfile() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken');
    const userId = cookieStore.get('userId');
    try {
        const result = await accountApiRequest.me(
            sessionToken?.value ?? '',
            userId?.value ?? ''
        );

        return (
            <div className="">
                <h1>Hello {result?.payload?.metadata?.name}</h1>
                <Profile />
            </div>
        );
    } catch (error) {
        if (error instanceof HttpError) handleMappedError({ error });
    }
}

export default MyProfile;
