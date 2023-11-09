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
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly server:string=environment.API_BASE_URL;
  constructor(private httpClient: HttpClient) { }

  private _refreshRequiered=new Subject<void>();
  get refresh(){
    return this._refreshRequiered;
  }
  public getUserDetails(userName:string){
    return this.httpClient.get<UserModal>(`${this.server}/userDetails/{userName}`)
  }
  public addProduct(product: FormData) {
    return this.httpClient.post<Product>(`${this.server}/product/addNewProduct`, product);
  }
  public getProducts(pageNumber:number,searchKeyword:string=""){
    return this.httpClient.get<Product[]>(`${this.server}/product/getAllProducts?pageNumber=`+pageNumber+"&searchKey="+searchKeyword);
  }
  public getAllProducts(pageNumber:number,searchKeyword:string="",categoryId:number,productBrandId:number,selectedSortValue:number){
    return this.httpClient.get<Product[]>(`${this.server}/product/getAllProducts?pageNumber=`+pageNumber+"&searchKey="+searchKeyword+"&categoryId="+categoryId+"&productBrandId="+productBrandId+"&selectedSortValue="+selectedSortValue);
  }
  public getAllProductsBaseOnTheCategory(pageNumber:number,searchKeyword:string="",categoryId:number){
    return this.httpClient.get<Product[]>(`${this.server}/product/getAllProducts?pageNumber=`+pageNumber+"&searchKey="+searchKeyword+"&categoryId="+categoryId);
  }

  public deleteProduct(productId:number){
    return this.httpClient.delete<Product>(`${this.server}/product/deleteProductDetails/`+productId);
  }

  public getProductDetailById(productId:number){
    return this.httpClient.get<Product>(`${this.server}/product/getProductDetailsById/`+productId);
  }
  public getProductDetails(isSingleProductChekout:boolean,productId: number){
    return this.httpClient.get<Product[]>(`${this.server}/product/getProductDetails/`+isSingleProductChekout+"/"+productId);
  }
  public placeOrder(orderDetails:OrderDetails,isCartChekout:boolean){
    return this.httpClient.post<OrderDetails>(`${this.server}/orders/placeOrder/`+isCartChekout,orderDetails);
  }
  public addToCart(productId:number){
    return this.httpClient.get(`${this.server}/cart/addToCart/`+productId).pipe(
      tap(()=>{
        this.refresh.next();
      })
    )
  }
  public getCartDetails(){
    return this.httpClient.get<CartDetails[]>(`${this.server}/cart/getCardDetails`)
  }
  public deleteCartItem(cartId:number){
    return this.httpClient.delete(`${this.server}/cart/deleteCartItem/`+cartId)
  }
  public getOrderDetails():Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>(`${this.server}/orders/getOrderDetails`)
  }

  public getAllOrderDetailsForAdmin(orderStatus:string):Observable<MyOrderDetails[]>{
    return this.httpClient.get<MyOrderDetails[]>(`${this.server}/orders/getAllOrderDetails/`+orderStatus)
  }
  public markOrderAsDelivered(orderId:number,addDays:number){
    return this.httpClient.get<MyOrderDetails[]>(`${this.server}/orders/markOrderAsDelivered/`+orderId+'/'+addDays)
  }
  public markOrderAsProcessing(orderId:number,addDays:number){
     return this.httpClient.get<MyOrderDetails[]>(`${this.server}/orders/markOrderAsProcessing/`+orderId+'/'+addDays)
  }
  public markOrderAsQualityCheck(orderId:number,addDays:number){
    return this.httpClient.get<MyOrderDetails[]>(`${this.server}/orders/markOrderAsQualityCheck/`+orderId+'/'+addDays)
  }

  createTransection(orderData: OrderDetails,userName:string,amount:number){
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<OrderDetails>(`${this.server}/orders/createTransection/`+userName+"/"+amount, JSON.stringify(orderData),{headers});
  }

  public addCategory(category:Category){
    return this.httpClient.post<Category>(`${this.server}/category/addNewCategory`,category)
  }
  public getAllCategories(){
    return this.httpClient.get<Category[]>(`${this.server}/category/getAllCategories`)
  }
  public getCategoryById(id:number){
    return this.httpClient.get<Category>(`${this.server}/category/getCategoryById/`+id)
  }
 public deleteCategory(id:number){
  return this.httpClient.delete(`${this.server}/category/deleteCategory/`+id)
 }
  public getWishList(){
    return this.httpClient.get<WishList[]>(`${this.server}/wishlist/getAllWishList`);
  }
  public addNewWishList(productId:number){
    return this.httpClient.get(`${this.server}/wishlist/addWishList?productId=`+productId);
  }

  public deleteWishListItem(wishListId:number){
    return this.httpClient.delete<WishList>(`${this.server}/wishlist/delete/`+wishListId);
  }
  public getAllBrand(categoryId:number){
    return this.httpClient.get<Brand[]>(`${this.server}/brand/getAllBrand?categoryId=`+categoryId);
  }
  public addNewBrand(brand:Brand){
    return this.httpClient.post<Brand>(`${this.server}/brand/addBrand`,brand);
  }
}

