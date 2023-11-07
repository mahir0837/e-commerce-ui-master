import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from './product.service';
import { WishList } from '../_model/wishlist-modal';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  wishList!: WishList
  public productId = new BehaviorSubject<number>(0);
  public wishListtId = new BehaviorSubject<number>(0);
  public wishListSize = new BehaviorSubject<number>(0);
  public wishListArr = new BehaviorSubject<WishList[]>([]);
 

  constructor(private productService: ProductService) {}

  addNewWishList() {
    this.productService.addNewWishList(this.productId.value).subscribe(resp=>{
      console.log(this.productId);
      
      resp=this.wishList;
      this.getWishList();
      console.log(resp);
      
    })
   return this.wishList;
  }
  getWishList() {
    this.productService.getWishList()
    .subscribe((resp) => {
    
      this.wishListArr.next(resp);
      this.wishListSize.next(resp.length);
      console.log(this.wishListSize.value);
      

    });
   return this.wishListArr.asObservable();
  }

  deleteWishListItem(){
    this.productService.deleteWishListItem(this.wishListtId.value).subscribe();
    
   this.getWishList();
    
  }
}
