import z from 'zod';

export const AccountRes = z
    .object({
        metadata: z.object({
            email: z.number(),
            name: z.string(),
            rules: z.array(z.string()),
            _id: z.string(),
        }),
        statusCode: z.number(),
        message: z.string(),
    })
    .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
    name: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
