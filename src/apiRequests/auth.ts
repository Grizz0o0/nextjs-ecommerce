import envConfig from '@/config';
import http from '@/lib/http';
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
    SlideSessionResType,
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

    auth: (body: {
        accessToken: string;
        refreshToken: string;
        userId: string;
    }) => http.post('api/auth', body, { baseUrl: '' }),

    logoutFromNextServerToServer: (accessToken: string, userId: string) =>
        http.post(
            '/v1/api/shop/logout',
            {},
            {
                headers: {
                    'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    'x-client-id': `${userId}`,
                    authorization: `${accessToken}`,
                },
            }
        ),

    logoutFromNextClientToNextServer: (force?: boolean | undefined) =>
        http.post('/api/auth/logout', { force }, { baseUrl: '' }),

    slideTokenNextServerToServer: (refreshToken: string, userId: string) =>
        http.post<SlideSessionResType>(
            '/v1/api/shop/handlerRefreshToken',
            {},
            {
                headers: {
                    'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    'x-client-id': `${userId}`,
                    'x-rtoken-id': `${refreshToken}`,
                },
            }
        ),

    slideTokenNextClientToNextServer: () =>
        http.post('/api/auth/slideToken', {}, { baseUrl: '' }),
};

export default authApiRequest;
