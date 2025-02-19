import productApiRequest from '@/apiRequests/product';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

async function ProductPublished() {
    const result = await productApiRequest.getAllProductPublished();
    console.log(result);
    return (
        <div className=" space-y-4 ">
            {result?.payload?.metadata?.map((product) => (
                <div key={product._id} className="flex flex-wrap px-8">
                    <Image
                        className="object-cover"
                        // src={product.product_thumb}
                        src="/product/product.jpg"
                        alt={product.product_name}
                        width={190}
                        height={190}
                    />
                    <div className="info p-2">
                        <h2 className="line-clamp-2 min-h-[3rem]">
                            {product.product_name}
                        </h2>
                        <p className="mt-2 font-medium">
                            Price: {product.product_price}$
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Button className="w-full bg-cyan-300 hover:bg-cyan-200">
                            Edit
                        </Button>
                        <Button className="w-full bg-red-500  hover:bg-red-400">
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductPublished;
