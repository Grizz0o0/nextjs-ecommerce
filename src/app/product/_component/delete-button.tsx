'use client';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleClientError } from '@/lib/utils';
import productApiRequest from '@/apiRequests/product';
import { HttpError } from '@/lib/http';
function DeleteButton({ product }: { product: any }) {
    const { toast } = useToast();
    const router = useRouter();
    const deleteProduct = async () => {
        try {
            const result = await productApiRequest.deleteProduct(product._id, {
                product_type: product.product_type,
            });
            toast({
                title: `Delete product "${product.product_name}" success !`,
                description: result.payload.message,
                className: 'bg-green-300 text-slate-50',
                duration: 500,
            });
            router.refresh();
        } catch (error: any) {
            if (error instanceof HttpError) {
                handleClientError({
                    error,
                });
            }
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full bg-red-500  hover:bg-red-400">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to delete this product?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        The product “{product.product_name}” will be permanently
                        deleted!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            className="bg-red-500  hover:bg-red-400"
                            onClick={deleteProduct}
                        >
                            Delete
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteButton;
