import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product.model';
import { OrderDetails } from '../_model/order-details-model';
import { MyOrderDetails } from '../_model/order.model';
import { Observable, Subject, tap } from 'rxjs';
import { CartDetails } from '../_model/cart-details-model';
import { Category } from '../_model/category-modal';
import { WishList } from '../_model/wishlist-modal';
import { Brand } from '../_model/brand-modal';
import { UserModal } from '../_model/user.modal';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  private _refreshRequiered=new Subject<void>();
  get refresh(){
    return this._refreshRequiered;
  }
  public getUserDetails(userName:string){
    return this.httpClient.get<UserModal>("http://localhost:9090/userDetails/{userName}")
  }
  public addProduct(product: FormData) {
    return this.httpClient.post<Product>("http://localhost:9090/product/addNewProduct", product);
  }
  public getProducts(pageNumber:number,searchKeyword:string=""){
    return this.httpClient.get<Product[]>("http://localhost:9090/product/getAllProducts?pageNumber="+pageNumber+"&searchKey="+searchKeyword);
  }
  public getAllProducts(pageNumber:number,searchKeyword:string="",categoryId:number,productBrandId:number,selectedSortValue:number){
    return this.httpClient.get<Product[]>("http://localhost:9090/product/getAllProducts?pageNumber="+pageNumber+"&searchKey="+searchKeyword+"&categoryId="+categoryId+"&productBrandId="+productBrandId+"&selectedSortValue="+selectedSortValue);
  }
  public getAllProductsBaseOnTheCategory(pageNumber:number,searchKeyword:string="",categoryId:number){
    return this.httpClient.get<Product[]>("http://localhost:9090/product/getAllProducts?pageNumber="+pageNumber+"&searchKey="+searchKeyword+"&categoryId="+categoryId);
  }

  public deleteProduct(productId:number){
    return this.httpClient.delete<Product>("http://localhost:9090/product/deleteProductDetails/"+productId);
  }

  public getProductDetailById(productId:number){
    return this.httpClient.get<Product>("http://localhost:9090/product/getProductDetailsById/"+productId);
  }
  public getProductDetails(isSingleProductChekout:boolean,productId: number){
    return this.httpClient.get<Product[]>("http://localhost:9090/product/getProductDetails/"+isSingleProductChekout+"/"+productId);
  }
  public placeOrder(orderDetails:OrderDetails,isCartChekout:boolean){
    return this.httpClient.post<OrderDetails>("http://localhost:9090/orders/placeOrder/"+isCartChekout,orderDetails);
  }
  public addToCart(productId:number){
    return this.httpClient.get("http://localhost:9090/cart/addToCart/"+productId).pipe(
      tap(()=>{
        this.refresh.next();
      })
    )
  }
  public getCartDetails(){
    return this.httpClient.get<CartDetails[]>("http://localhost:9090/cart/getCardDetails")
  }
  public deleteCartItem(cartId:number){
    return this.httpClient.delete("http://localhost:9090/cart/deleteCartItem/"+cartId)
  }
  public getOrderDetails():Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>("http://localhost:9090/orders/getOrderDetails")
  }

  public getAllOrderDetailsForAdmin(orderStatus:string):Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>("http://localhost:9090/orders/getAllOrderDetails/"+orderStatus)
  }
  public markOrderAsDelivered(orderId:number,addDays:number){
    return this.httpClient.get<MyOrderDetails[]>("http://localhost:9090/orders/markOrderAsDelivered/"+orderId+'/'+addDays)
  }
  public markOrderAsProcessing(orderId:number,addDays:number){
     return this.httpClient.get<MyOrderDetails[]>("http://localhost:9090/orders/markOrderAsProcessing/"+orderId+'/'+addDays)
  }
  public markOrderAsQualityCheck(orderId:number,addDays:number){
    return this.httpClient.get<MyOrderDetails[]>("http://localhost:9090/orders/markOrderAsQualityCheck/"+orderId+'/'+addDays)
  }

  createTransection(orderData: OrderDetails,userName:string,amount:number){
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<OrderDetails>("http://localhost:9090/orders/createTransection/"+userName+"/"+amount, JSON.stringify(orderData),{headers});
  }

  public addCategory(category:Category){
    return this.httpClient.post<Category>("http://localhost:9090/category/addNewCategory",category)
  }
  public getAllCategories(){
    return this.httpClient.get<Category[]>("http://localhost:9090/category/getAllCategories")
  }
  public getCategoryById(id:number){
    return this.httpClient.get<Category>("http://localhost:9090/category/getCategoryById/"+id)
  }
 public deleteCategory(id:number){
  return this.httpClient.delete("http://localhost:9090/category/deleteCategory/"+id)
 }
  public getWishList(){
    return this.httpClient.get<WishList[]>("http://localhost:9090/wishlist/getAllWishList");
  }
  public addNewWishList(productId:number){
    return this.httpClient.get("http://localhost:9090/wishlist/addWishList?productId="+productId);
  }

  public deleteWishListItem(wishListId:number){
    return this.httpClient.delete<WishList>("http://localhost:9090/wishlist/delete/"+wishListId);
  }
  public getAllBrand(categoryId:number){
    return this.httpClient.get<Brand[]>("http://localhost:9090/brand/getAllBrand?categoryId="+categoryId);
  }
  public addNewBrand(brand:Brand){
    return this.httpClient.post<Brand>("http://localhost:9090/brand/addBrand",brand);
  }
}

