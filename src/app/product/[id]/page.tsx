import productApiRequest from '@/apiRequests/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const decodedId = decodeURIComponent(params.id);
    const result = await productApiRequest.getProductById(decodedId);

    if (!result || !result.payload || !result.payload.metadata) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">
                    Product Not Found
                </h1>
            </div>
        );
    }

    const product = result.payload.metadata;

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Hình ảnh sản phẩm */}
                <div className="flex justify-center">
                    <Image
                        src={'/product/product.jpg'}
                        alt={product.product_name}
                        width={400}
                        height={400}
                        className="rounded-lg shadow-lg"
                    />
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {product.product_name}
                    </h1>

                    {/* Đánh giá sản phẩm */}
                    <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                className={`w-5 h-5 ${
                                    index < product.product_ratingAverage
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="ml-2 text-gray-600">
                            {product.product_ratingAverage} / 5
                        </span>
                    </div>

                    {/* Giá sản phẩm */}
                    <p className="mt-4 text-2xl font-semibold text-red-600">
                        ${product.product_price}
                    </p>

                    {/* Mô tả sản phẩm */}
                    <p className="mt-4 text-gray-700">
                        {product.product_description}
                    </p>

                    {/* Thuộc tính sản phẩm */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Product Attributes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                                Manufacturer:{' '}
                                {product.product_attributes.manufacturer}
                            </Badge>
                            <Badge variant="outline">
                                Color: {product.product_attributes.color}
                            </Badge>
                            <Badge variant="outline">
                                Model: {product.product_attributes.model}
                            </Badge>
                        </div>
                    </div>

                    {/* Hành động */}
                    <div className="mt-6 flex gap-4">
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            Add to Cart
                        </Button>
                        <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
