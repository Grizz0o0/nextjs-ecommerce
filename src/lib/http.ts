import envConfig from '@/config';
import { LoginResType, RegisterResType } from '@/schemaValidations/auth.schema';
import { isClient, normalizePath } from './utils';

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined;
};

export class HttpError extends Error {
    status: number;

    constructor({ status, message }: { status: number; message: string }) {
        super(message || 'Http Error');
        this.status = status;
    }
}

class SessionToken {
    private token = '';
    private userId = '';

    get value() {
        return this.token;
    }
    set value(token: string) {
        // Nếu gọi method này ở server thì sẽ bị lỗi
        if (!isClient()) {
            throw new Error('Cannot set token on server side');
        }
        this.token = token;
    }

    get user() {
        return this.userId;
    }
    set user(userId: string) {
        if (!isClient()) {
            throw new Error('Cannot set userId on server side');
        }
        this.userId = userId;
    }
}

export const clientSessionToken = new SessionToken();

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeaders = {
        'Content-Type': 'application/json',
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
        const errorPayload = payload as HttpError;
        throw new HttpError({
            status: res.status,
            message: errorPayload.message || 'Unknown error occurred',
        });
    }
    if (isClient()) {
        if ('v1/api/shop/login'.includes(normalizePath(url))) {
            clientSessionToken.value = (
                payload as LoginResType
            ).metadata.tokens.accessToken;
            clientSessionToken.user = (
                payload as LoginResType
            ).metadata.shop._id;
        } else if ('v1/api/shop/signup'.includes(normalizePath(url))) {
            clientSessionToken.value = (
                payload as RegisterResType
            ).metadata.tokens.accessToken;
            clientSessionToken.user = (
                payload as RegisterResType
            ).metadata.shop._id;
        } else if ('v1/api/shop/logout'.includes(normalizePath(url))) {
            clientSessionToken.value = '';
            clientSessionToken.value = '';
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
    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PUT', url, { ...options, body });
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
