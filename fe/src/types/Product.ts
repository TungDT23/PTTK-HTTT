

export interface Product {
   _id: string;
   title: string;
   description: string;
   category: 'book' | 'stationery';
   price: number;
   discountPercentage: number;
   rating: number;
   stock: number;
   thumbnail: string;
   isActive: boolean;
   slug: string;
}

export interface ProductForm {
   title: string;
   description: string;
   category: 'book' | 'stationery';
   price: number | string;
   discountPercentage: number | string;
   rating: number | string;
   stock: number | string;
   thumbnail: string;
   isActive: boolean;
   slug: string;
}
