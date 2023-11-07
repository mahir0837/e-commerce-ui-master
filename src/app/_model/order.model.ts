import { Product } from "./product.model";

export interface MyOrderDetails{
    orderId:number;
    orderFullName:string;
    orderFullOrder:string;
    orderFullAddres:string;
    orderContactNumber:string
    orderAlternateContactNumber:string;
    orderStatus:string;
    orderAmount:number;
    orderDate:Date;
    addedDays:string;
    trackingNumber:string;
    product:Product;
    user:any;
}