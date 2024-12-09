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
import authApiRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { handleMappedError } from '@/lib/utils';
import { HttpError } from '@/lib/http';

export default function LoginForm() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginBodyType) {
        try {
            const result = await authApiRequest.login(values);
            toast({
                title: 'Login success !',
                description: '',
                className: 'bg-green-300 text-slate-50',
                duration: 500,
            });

            await authApiRequest.auth({
                sessionToken: result.payload.metadata.tokens.accessToken,
                userId: result.payload.metadata.shop._id,
            });

            router.push('/me');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error instanceof HttpError) {
                handleMappedError({
                    error,
                    setError: form.setError,
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
