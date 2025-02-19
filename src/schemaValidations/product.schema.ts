import z from 'zod';

export const CreateProductBody = z.object({
    product_name: z.string(),
    product_description: z.string(),
    product_price: z.number(),
    product_type: z.enum(['Electronics', 'Clothing', 'Furniture']),
    product_thumb: z.string(),
    product_quantity: z.number(),
    product_attributes: z.record(z.string(), z.string()),
});
export type CreateProductBodyType = z.infer<typeof CreateProductBody>;

export const CreateProductRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.object({
        product_name: z.string(),
        product_thumb: z.string(),
        product_description: z.string(),
        product_price: z.number(),
        product_quantity: z.number(),
        product_type: z.enum(['Electronics', 'Clothing', 'Furniture']),
        product_shop: z.string(),
        product_attributes: z.record(z.string(), z.string()),
        product_ratingAverage: z.number().gte(1).lte(5),
        product_variations: z.array(z.string()),
        isDraft: z.boolean(),
        isPublished: z.boolean(),
        _id: z.string(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
        product_slug: z.string(),
        __v: z.number(),
    }),
});
export type CreateProductResType = z.infer<typeof CreateProductRes>;

// Schema chung cho sản phẩm
const ProductBase = z.object({
    _id: z.string(),
    product_name: z.string(),
    product_thumb: z.string(),
    product_description: z.string(),
    product_price: z.number(),
    product_quantity: z.number(),
    product_type: z.enum(['Electronics', 'Clothing', 'Furniture']),
    product_shop: z.object({
        name: z.string(),
        email: z.string(),
    }),
    product_attributes: z.record(z.string(), z.string()),
    product_ratingAverage: z.number().gte(1).lte(5),
    product_variations: z.array(z.string()),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    product_slug: z.string(),
    __v: z.number(),
});

export const GetProductRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: ProductBase.extend({
        product_shop: z.string(),
    }),
});
export type GetProductResType = z.infer<typeof GetProductRes>;

// Schema cho danh sách sản phẩm
export const GetProductListRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.array(ProductBase),
});
export type GetProductListResType = z.infer<typeof GetProductListRes>;

// Schema cho tìm kiếm sản phẩm (thêm trường 'score')
export const GetProductSearchRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.array(
        ProductBase.extend({
            product_shop: z.string(),
            score: z.number(),
        })
    ),
});
export type GetProductSearchResType = z.infer<typeof GetProductSearchRes>;

export const GetAllProductRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.array(
        z.object({
            _id: z.string(),
            product_name: z.string(),
            product_thumb: z.string(),
            product_price: z.number(),
            product_type: z.enum(['Electronics', 'Clothing', 'Furniture']),
            product_shop: z.string(),
        })
    ),
});
export type GetAllProductResType = z.infer<typeof GetAllProductRes>;

export const UpdateProductBody = z.object({
    product_name: z.string().optional(),
    product_thumb: z.string().optional(),
    product_description: z.string().optional(),
    product_price: z.number().optional(),
    product_quantity: z.number().optional(),
    product_type: z.enum(['Electronics', 'Clothing', 'Furniture']).optional(),
    product_attributes: z.record(z.string(), z.string()).optional(),
    product_ratingAverage: z.number().gte(1).lte(5).optional(),
    product_variations: z.array(z.string()).optional(),
});
export type UpdateProductBodyType = z.infer<typeof UpdateProductBody>;

export const UpdateProductRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.array(
        ProductBase.extend({
            product_shop: z.string(),
        })
    ),
});
export type UpdateProductResType = z.infer<typeof UpdateProductRes>;

export const DeleteProductRes = z.object({
    message: z.string(),
    statusCode: z.number(),
    metadata: z.array(
        ProductBase.extend({
            product_shop: z.string(),
        })
    ),
});
export type DeleteProductResType = z.infer<typeof DeleteProductRes>;
