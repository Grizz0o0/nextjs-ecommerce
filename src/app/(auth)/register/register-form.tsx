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
import {
    RegisterBodyType,
    RegisterBody,
} from '@/schemaValidations/auth.schema';
import envConfig from '@/config';

export default function RegisterForm() {
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
            const res = await fetch(
                `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/v1/api/shop/signup`,
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

            // Nếu không có lỗi, lấy dữ liệu thành công
            const data = await res.json();
            console.log('Success:', data);
            if (!res.ok) {
                throw data;
            }
        } catch (error) {
            console.log(error);
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
