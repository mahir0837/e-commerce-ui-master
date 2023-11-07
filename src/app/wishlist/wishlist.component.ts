import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart-service';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs';
import { WishListService } from '../_services/wishList.service';
import { WishList } from '../_model/wishlist-modal';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishList: WishList[] = [];
  productCount = 0;
  product: Product[] = [];
  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private imageProcess: ImageProcessingService,
    private wishListService: WishListService
  ) {}
  ngOnInit(): void {
  this.productService.refresh.subscribe(resp=>{
    this.getWishList();
  });
    this.getWishList();
  }
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'description',
    'Product Discounted Price',
    'Product Actual Price',
    'Actions',
  ];

  buyProduct(productId: number) {
    this.router.navigate([
      '/buyProduct',
      {
        isSingleProductChekout: true,
        id: productId,
      },
    ]);
  }
  addToCart(productId: number) {
    this.cartService.addToCart(productId);
    
  }
  addToWishList() {
    this.wishListService.addNewWishList;
    this.wishListService.deleteWishListItem();
  }
  getWishList() {
    this.wishListService.getWishList().subscribe((resp) => {
      this.wishList=resp;
      for (let i = 0; i < resp.length; i++) {
        this.wishList[i].product = resp[i].product;
        this.imageProcess.createImages(this.wishList[i].product);
      }
      this.productCount = resp.length;
    });
  }
  deleteWishListItem(wishId: number) {
    this.wishListService.wishListtId.next(wishId);
    this.wishListService.deleteWishListItem();
    this.productCount=this.productCount;
    window.location.reload();
    
  }
 
  
}
