'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginBodyType, LoginBody } from '@/schemaValidations/auth.schema';
import envConfig from '@/config';
import { useAppContext } from '@/app/AppProvider';

export default function LoginForm() {
    const { toast } = useToast();
    const { setSessionToken } = useAppContext();
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginBodyType) {
        try {
            const result = await fetch(
                `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/v1/api/shop/login`,
                {
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    },
                    method: 'POST',
                }
            ).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload,
                };
                if (!res.ok) {
                    throw data;
                }
                return data;
            });
            toast({
                title: 'Login success !',
                description: '',
                className: 'bg-green-300 text-slate-50',
            });
            const resultFormNextServer = await fetch('/api/auth', {
                body: JSON.stringify(result),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload,
                };
                if (!res.ok) {
                    throw data;
                }
                return data;
            });
            setSessionToken(
                resultFormNextServer?.payload?.metadata?.tokens?.accessToken
            );
            console.log(resultFormNextServer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const payload = error.payload as {
                code: number;
                message: string;
                stack: string;
                status: string;
            };

            if (payload?.status === 'error' && payload?.code === 401) {
                form.setError('password', {
                    type: 'server',
                    message: 'Invalid email or password. Please try again!',
                });
            } else {
                toast({
                    title: 'Lỗi',
                    description:
                        error?.message || 'Đã xảy ra lỗi không xác định.',
                    variant: 'destructive',
                });
            }
        }
    }
    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-[600px] w-full"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="..."
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="!mt-8 w-full">
                    Sign in
                </Button>
            </form>
        </Form>
    );
}
