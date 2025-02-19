import envConfig from '@/config';
import http from '@/lib/http';
import {
    CreateProductBodyType,
    CreateProductResType,
    GetAllProductResType,
    GetProductListResType,
    GetProductResType,
    GetProductSearchResType,
    UpdateProductBodyType,
    UpdateProductResType,
} from '@/schemaValidations/product.schema';

const productApiRequest = {
    getProductList: () =>
        http.get<GetAllProductResType>('/v1/api/product', {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    createProduct: (body: CreateProductBodyType) =>
        http.post<CreateProductResType>('/v1/api/product', body, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    updateProduct: (productId: string, body: UpdateProductBodyType) =>
        http.patch<UpdateProductResType>(`/v1/api/product/${productId}`, body, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    getProductById: (productId: string) =>
        http.get<GetProductResType>(`/v1/api/product/${productId}`, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    getAllProductPublished: () =>
        http.get<GetProductListResType>('/v1/api/product/published/all', {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    getAllProductDrafts: () =>
        http.get<GetProductListResType>('/v1/api/product/drafts/all', {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    getListSearchProduct: (search: string) =>
        http.get<GetProductSearchResType>(`/v1/api/product/search/${search}`, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    setProductToPublished: (productId: string) =>
        http.post(`/v1/api/product/publish/${productId}`, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),

    setProductToUnPublished: (productId: string) =>
        http.post(`/v1/api/product/unpublish/${productId}`, {
            headers: {
                'x-api-key': envConfig.NEXT_PUBLIC_X_API_KEY,
            },
        }),
};

export default productApiRequest;
