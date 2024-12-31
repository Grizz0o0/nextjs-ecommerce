import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HttpError } from './http';
import { UseFormSetError } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
    return undefined;
}

type PayloadJWT = {
    userId: string;
    email: string;
    iat: number;
    exp: number;
};
export type ErrorMapping = {
    [key: number]: { name: string; message: string } | undefined;
};

const LoginErrorMapping: ErrorMapping = {
    401: {
        name: 'password',
        message: 'Invalid email or password. Please try again!',
    },
    403: {
        name: 'email',
        message:
            'The email address is not registered. Please check your entry.',
    },
};

export function handleServerError(error: HttpError) {
    if (error.status === 401) {
        // Lỗi 401 - Unauthorized
        redirect(error.message); //Redirect sang trang login
    } else {
        console.error('Server error:', error);
    }
}

export function handleClientError({
    error,
    setError,
    errorMapping = LoginErrorMapping,
    duration = 2000,
}: {
    error: HttpError;
    setError?: UseFormSetError<any>;
    errorMapping?: ErrorMapping;
    duration?: number;
}) {
    const errorOption = errorMapping[error.status];
    if (errorOption) {
        handleErrorApi({
            error,
            setError,
            duration,
            option: errorOption,
        });
    } else {
        handleErrorApi({ error });
    }
}

export function handleErrorApi({
    error,
    setError,
    duration = 2000,
    option,
}: {
    error: HttpError;
    setError?: UseFormSetError<any>;
    duration?: number;
    option?: { name: string; message: string } | undefined;
}) {
    if (setError && option?.name && option?.message) {
        setError(option.name, {
            type: 'server',
            message: option.message,
        });
    } else {
        toast({
            title: 'Error',
            description:
                option?.message || error.message || 'Unknown error occurred.',
            duration,
            variant: 'destructive',
        });
    }
}
export const isClient = () => typeof window !== 'undefined';

export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path;
};

export const decodeJWT = <Payload>(token: string) => {
    return jwt.decode(token) as Payload;
};
export const getExpireAt = (token: string): Date | undefined => {
    try {
        const tokenPayload = decodeJWT<PayloadJWT>(token);
        if (!tokenPayload?.exp) {
            throw new Error('Invalid token payload: missing exp');
        }

        return new Date(tokenPayload.exp * 1000); // chuyển từ giây sang mili giây
    } catch (error) {
        console.error('Failed to decode token:', error);
    }
};
