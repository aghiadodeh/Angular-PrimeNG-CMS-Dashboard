export interface Product {
    id?: number;
    title?: string;
    description?: string;
    price?: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    brand?: string;
    category?: string;
    thumbnail?: string;
    createdAt?: string | null;
    updatedAt?: string;
}
