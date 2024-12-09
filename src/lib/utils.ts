import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HttpError } from './http';
import { UseFormSetError } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

export function handleMappedError({
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
