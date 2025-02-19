import productApiRequest from '@/apiRequests/product';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductSearch({
    params,
}: {
    params: Promise<{ query: string }>;
}) {
    const { query } = await params;
    const decodedSlug = decodeURIComponent(query);
    const result = await productApiRequest.getListSearchProduct(decodedSlug);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Product Search: {decodedSlug}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {result.payload.metadata.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white shadow-md rounded-lg overflow-hidden "
                    >
                        <Image
                            className="object-cover w-full h-48"
                            // src={product.product_thumb}
                            src="/product/product.jpg"
                            alt={product.product_name}
                            width={190}
                            height={190}
                            priority
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                                {product.product_name}
                            </h2>
                            <p className="mt-2 text-gray-600 font-medium">
                                Price: {product.product_price}$
                            </p>
                            <Link href={`/product/${product._id}`}>
                                <Button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                                    View Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
