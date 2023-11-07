import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../_model/product.model';
import { ProductService } from './product.service';
import { CartDetails } from '../_model/cart-details-model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  totalItem: number = 0;
  totalAmount: number = 10;
  cart: BehaviorSubject<CartDetails[]> = new BehaviorSubject<CartDetails[]>([]);

  constructor(private productService: ProductService) { }

  addToCart(productId:number){
    console.log(productId);
    this.productService.addToCart(productId).subscribe(
      (resp)=>{
        console.log(resp);
      },(err)=>{
        console.log(err);
        
      }
    );
  }
  getCartDetails() {
    this.productService.getCartDetails().subscribe((resp) => {
      this.cart.next(resp);
    });
   return this.cart.asObservable();
  }


    removeItem(cartId: number) {
      this.productService.deleteCartItem(cartId).subscribe();
      this.getCartDetails();
    }
}
