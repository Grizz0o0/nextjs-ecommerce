'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

export default function LoginForm() {
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginBodyType) {
        try {
            const res = await fetch(
                `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/v1/api/shop/login`,
                {
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
                    },
                    method: 'POST',
                }
            );

            // Kiểm tra nếu phản hồi có trạng thái lỗi
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }

            // Nếu không có lỗi, lấy dữ liệu thành công
            const data = await res.json();
            console.log('Success:', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message); // Hiển thị thông báo lỗi cho người dùng
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
