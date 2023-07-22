export interface ProductModel{
    id :string;
    name: String;
    price: number;
    promotion: boolean;
}

export interface PageProduct{
  products: ProductModel[];
  page: number;
  size: number;
  totalPages:number;
}
