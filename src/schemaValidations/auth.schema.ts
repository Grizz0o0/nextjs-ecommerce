import z from 'zod';

export const RegisterBody = z
    .object({
        name: z.string().trim().min(2).max(256),
        email: z
            .string()
            .email({ message: 'Please enter a valid email address' }),
        password: z.string().min(6).max(100),
        confirmPassword: z.string().min(6).max(100),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords you entered do not match',
                path: ['confirmPassword'],
            });
        }
    });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
    message: z.string(),
    metadata: z.object({
        shop: z.object({
            email: z.string(),
            _id: z.string(),
            name: z.string(),
        }),
        tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
    }),
    options: z.object({
        limit: z.number(),
    }),
    statusCode: z.number(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
    .object({
        email: z.string().email(),
        password: z.string().min(6).max(100),
    })
    .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
    message: z.string(),
    metadata: z.object({
        shop: z.object({
            email: z.string(),
            name: z.string(),
            _id: z.string(),
        }),
        tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
    }),
});

export const RefreshTokenRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.object({
        user: z.object({
            userId: z.string(),
            email: z.string(),
            iat: z.number(),
            exp: z.number(),
        }),
        tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
    }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export type SlideSessionResType = z.TypeOf<typeof RefreshTokenRes>;
