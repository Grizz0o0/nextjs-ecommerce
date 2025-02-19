import envConfig from '@/config';
import { LoginResType, RegisterResType } from '@/schemaValidations/auth.schema';
import { isClient, normalizePath } from './utils';

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined;
};

const AUTHENTICATION_STATUS = 401;
export class HttpError extends Error {
    status: number;

    constructor({ status, message }: { status: number; message: string }) {
        super(message || 'Http Error');
        this.status = status;
    }
}

class Token {
    private _accessToken = '';
    private _refreshToken = '';
    private _userId = '';

    get accessToken() {
        return this._accessToken;
    }
    set accessToken(accessToken: string) {
        if (!isClient()) {
            throw new Error('Cannot set accessToken on server side');
        }
        this._accessToken = accessToken;
    }

    get refreshToken() {
        return this._refreshToken;
    }
    set refreshToken(refreshToken: string) {
        if (!isClient()) {
            throw new Error('Cannot set refreshToken on server side');
        }
        this._refreshToken = refreshToken;
    }

    get userId() {
        return this._userId;
    }
    set userId(userId: string) {
        if (!isClient()) {
            throw new Error('Cannot set userId on server side');
        }
        this._userId = userId;
    }
}

export const clientToken = new Token();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    options?: CustomOptions | undefined
) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeaders = {
        'Content-Type': 'application/json',
        authorization: clientToken.accessToken
            ? `${clientToken.accessToken}`
            : '',
        'x-client-id': clientToken.userId || '',
    };

    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
    // Nếu truyền vào baseUrl thì lấy giá trị truyền vào, truyền vào '' thì ta gọi API đến nextjs Server
    const baseUrl =
        options?.baseUrl === undefined
            ? envConfig.NEXT_PUBLIC_API_ENDPOINT
            : options.baseUrl;

    const fullUrl = url.startsWith('/')
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;
    console.log(fullUrl);

    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        body,
        method,
    });
    const payload: Response = await res.json();
    console.log(payload);
    const data = {
        status: res.status,
        payload,
    };

    if (!res.ok) {
        if (res.status === AUTHENTICATION_STATUS) {
            if (typeof window !== 'undefined') {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = fetch('/api/auth/logout', {
                        method: 'POST',
                        body: JSON.stringify({ force: true }),
                        headers: {
                            ...baseHeaders,
                        },
                    });
                    await clientLogoutRequest;
                    clientToken.accessToken = '';
                    clientToken.refreshToken = '';
                    clientToken.userId = '';
                    location.href = '/login'; // Redirect on client-side
                }
            } else {
                const accessToken =
                    (options?.headers as any)?.authorization || '';
                console.log(accessToken);

                throw new HttpError({
                    status: AUTHENTICATION_STATUS,
                    message: `/logout?accessToken=${accessToken}`,
                });
            }
        } else {
            const errorPayload = payload as HttpError;
            throw new HttpError({
                status: res.status,
                message: errorPayload.message || 'Unknown error occurred',
            });
        }
    }

    if (isClient()) {
        if ('v1/api/shop/login'.includes(normalizePath(url))) {
            clientToken.accessToken = (
                payload as LoginResType
            ).metadata.tokens.accessToken;
            clientToken.refreshToken = (
                payload as LoginResType
            ).metadata.tokens.refreshToken;
            clientToken.userId = (payload as LoginResType).metadata.shop._id;
        } else if ('v1/api/shop/signup'.includes(normalizePath(url))) {
            clientToken.accessToken = (
                payload as RegisterResType
            ).metadata.tokens.accessToken;
            clientToken.refreshToken = (
                payload as RegisterResType
            ).metadata.tokens.refreshToken;
            clientToken.userId = (payload as RegisterResType).metadata.shop._id;
        } else if ('v1/api/shop/logout'.includes(normalizePath(url))) {
            clientToken.accessToken = '';
            clientToken.refreshToken = '';
            clientToken.userId = '';
        }
    }

    return data;
};

const http = {
    get<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('GET', url, options);
    },
    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('POST', url, { ...options, body });
    },
    patch<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PATCH', url, { ...options, body });
    },
    delete<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('DELETE', url, { ...options, body });
    },
};

export default http;
