import { Product } from "./product.model"

export interface CartDetails {
    cartId:number;
    product:Product,
    user:any
}