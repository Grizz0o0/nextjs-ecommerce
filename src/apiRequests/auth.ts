import envConfig from '@/config';
import http from '@/lib/http';
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';

const authApiRequest = {
    login: (body: LoginBodyType) =>
        http.post<LoginResType>('/v1/api/shop/login', body, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    register: (body: RegisterBodyType) =>
        http.post<RegisterResType>('/v1/api/shop/signup', body, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    auth: (body: { sessionToken: string; userId: string }) =>
        http.post('api/auth', body, { baseUrl: '' }),

    logoutFromNextServerToServer: (sessionToken: string, userId: string) =>
        http.post(
            '/v1/api/shop/logout',
            {},
            {
                headers: {
                    'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    'x-client-id': `${userId}`,
                    authorization: `${sessionToken}`,
                },
            }
        ),

    logoutFromNextClientToNextServer: () =>
        http.post('/api/auth/logout', {}, { baseUrl: '' }),
};

export default authApiRequest;
