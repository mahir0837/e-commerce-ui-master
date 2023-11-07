import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { CartService } from '../_services/cart-service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.scss'],
})
export class ProductViewDetailsComponent implements OnInit {
  selectedProductIndex = 0;
  product!: Product;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];
    console.log(this.product);
  }
  changeIndex(index: number) {
    this.selectedProductIndex = index;
  }
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
}
