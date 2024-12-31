import { cookies } from 'next/headers';
import Profile from './profile';
import accountApiRequest from '@/apiRequests/account';
import { handleServerError } from '@/lib/utils';
import { HttpError } from '@/lib/http';

async function MyProfile() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const userId = cookieStore.get('userId');

    try {
        const result = await accountApiRequest.me(
            accessToken?.value ?? '',
            userId?.value ?? ''
        );

        return (
            <div className="">
                <h1>Hello {result?.payload?.metadata?.name}</h1>
                <Profile />
            </div>
        );
    } catch (error) {
        if (error instanceof HttpError) handleServerError(error);
    }
}

export default MyProfile;
