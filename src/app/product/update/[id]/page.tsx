import productApiRequest from '@/apiRequests/product';
import ProductForm from '../../_component/product-form';

async function ProductUpdatePage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const product = await productApiRequest.getProductById(decodedId);
    return (
        <div>
            <h1>Product Update Page</h1>
            <ProductForm product={product.payload.metadata} />
        </div>
    );
}

export default ProductUpdatePage;
