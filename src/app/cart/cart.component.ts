import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart-service';
import { CartDetails } from '../_model/cart-details-model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  amount: number = 0;
  ngOnInit(): void {
    this.getCartDetails();
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  displayedColumns: string[] = [
    'Name',
    'Description',
    'Price',
    'Discounted Price',
    'Action',
  ];

  cartDetails: CartDetails[] = [];

 

getCartDetails() {
  this.cartService.getCartDetails().subscribe(
    resp=>{
      this.cartDetails=resp;
    }
  );
  
}
  chekout() {
    this.router.navigate([
      '/buyProduct',
      {
        isSingleProductChekout: false,
        id: 0,
      },
    ]);
  }
  delete(cartId: number) {
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        this.getCartDetails();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
