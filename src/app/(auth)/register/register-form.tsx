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
import {
    RegisterBodyType,
    RegisterBody,
} from '@/schemaValidations/auth.schema';
import authApiRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { HttpError } from '@/lib/http';
import { ErrorMapping, handleClientError } from '@/lib/utils';

export default function RegisterForm() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: RegisterBodyType) {
        try {
            const result = await authApiRequest.register(values);
            toast({
                title: 'Sign-up success !',
                description: '',
                duration: 500,
                className: 'bg-green-300 text-slate-50',
            });
            await authApiRequest.auth({
                sessionToken: result.payload.metadata.tokens.accessToken,
                userId: result.payload.metadata.shop._id,
            });

            router.push('/me');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error instanceof HttpError) {
                const registerErrorMapping: ErrorMapping = {
                    403: {
                        name: 'email',
                        message:
                            'This email is not registered. Please check and try again.',
                    },
                };
                handleClientError({
                    error,
                    setError: form.setError,
                    errorMapping: registerErrorMapping,
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                    Registered
                </Button>
            </form>
        </Form>
    );
}
