import { Category } from "./category-modal";
import { FileHandle } from "./file-handle.model"

export interface Product {
    productId: number
    productName: string,
    productDescription: string,
    productDiscountedPrice: number,
    productActualPrice: number,
    productCategory:number,
    productBrand:number,
    productImages: FileHandle[]
}