'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
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
import { useRouter } from 'next/navigation';
import { handleClientError } from '@/lib/utils';
import { HttpError } from '@/lib/http';
import {
    CreateProductBodyType,
    CreateProductBody,
    GetProductResType,
    UpdateProductBodyType,
} from '@/schemaValidations/product.schema';
import productApiRequest from '@/apiRequests/product';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const defaultAttributes = {
    Electronics: { manufacturer: '', model: '', color: '' },
    Clothing: { brand: '', size: '', material: '' },
    Furniture: { manufacturer: '', model: '', color: '' },
};

type Product = GetProductResType['metadata'];
export default function ProductForm({ product }: { product?: Product }) {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<CreateProductBodyType>({
        resolver: zodResolver(CreateProductBody),
        defaultValues: {
            product_name: product?.product_name || '',
            product_description: product?.product_description || '',
            product_price: product?.product_price || 0,
            product_type: product?.product_type || undefined,
            product_thumb: product?.product_thumb || '',
            product_quantity: product?.product_quantity || 0,
            product_attributes: product?.product_attributes || {},
        },
    });

    const handleTypeChange = (
        value: 'Electronics' | 'Clothing' | 'Furniture'
    ) => {
        form.setValue('product_type', value);
        form.setValue('product_attributes', defaultAttributes[value] || {});
    };

    const createProduct = async (values: CreateProductBodyType) => {
        try {
            await productApiRequest.createProduct(values);
            toast({
                title: 'Create product success !',
                description: '',
                className: 'bg-green-300 text-slate-50',
                duration: 500,
            });
            router.push('/product');
        } catch (error) {
            if (error instanceof HttpError) {
                handleClientError({
                    error,
                    setError: form.setError,
                });
            }
        }
    };

    const updateProduct = async (values: UpdateProductBodyType) => {
        try {
            if (!product) return;
            await productApiRequest.updateProduct(product?._id, values);
            toast({
                title: 'Update product success !',
                description: '',
                className: 'bg-green-300 text-slate-50',
                duration: 500,
            });
        } catch (error) {
            if (error instanceof HttpError) {
                handleClientError({
                    error,
                    setError: form.setError,
                });
            }
        }
    };

    async function onSubmit(
        values: CreateProductBodyType | UpdateProductBodyType
    ) {
        if (product) {
            await updateProduct(values as UpdateProductBodyType);
        } else {
            await createProduct(values as CreateProductBodyType);
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
                    name="product_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_name</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_price</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter product price"
                                    type="number"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_type</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={handleTypeChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electronics">
                                            Electronics
                                        </SelectItem>
                                        <SelectItem value="Clothing">
                                            Clothing
                                        </SelectItem>
                                        <SelectItem value="Furniture">
                                            Furniture
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_thumb"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_thumb</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>product_quantity</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter product price"
                                    type="number"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product_attributes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Attributes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter JSON object for attributes"
                                    value={JSON.stringify(field.value, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsedValue = JSON.parse(
                                                e.target.value
                                            );
                                            field.onChange(parsedValue);
                                        } catch {}
                                    }}
                                    rows={5}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-8 w-full">
                    {product ? 'Update' : 'Add'}
                </Button>
            </form>
        </Form>
    );
}
