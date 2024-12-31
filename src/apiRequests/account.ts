import envConfig from '@/config';
import http from '@/lib/http';
import { AccountResType } from '@/schemaValidations/account.schema';

const accountApiRequest = {
    me: (accessToken: string, userId: string) =>
        http.get<AccountResType>('/v1/api/shop/me', {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                'x-client-id': `${userId}`,
                authorization: `${accessToken}`,
            },
        }),
};

export default accountApiRequest;
