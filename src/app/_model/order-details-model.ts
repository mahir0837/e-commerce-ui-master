import { OrderQuantity } from "./order-quantity-model";
import { Product } from "./product.model";

export interface OrderDetails {

    fullName: string;
    fullAddress: string;
    contactNumber: string;
    alternateContactNumber: string;
    paymentMethod:string,
    orderDate:Date;
    trackingNumber:string,
    orderProductQuantityList: OrderQuantity[];
}