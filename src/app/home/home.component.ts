import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart-service';
import { CartDetails } from '../_model/cart-details-model';
import { UserService } from '../_services/user.service';
import { HeaderService } from '../_services/header.service';
import { WishListService } from '../_services/wishList.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isWishListAdded: boolean = true;
  images = [
    {
      imageSrc: '/assets/img/Data/01.jpg',
      imageAlt: 'nature1',
      paragraphDescription: 'Has just arrived!',
      subDescription: 'Huge Summer Collection',
      adv: 'Swimwear, Tops, Shorts, Sunglasses & much more...',
    },
    {
      imageSrc: '/assets/img/Data/02.jpg',
      imageAlt: 'nature2',
      paragraphDescription: 'Has just arrived!',
      subDescription: 'Huge Summer Collection',
      adv: 'Swimwear, Tops, Shorts, Sunglasses & much more...',
    },
    {
      imageSrc: '/assets/img/Data/03.jpg',
      imageAlt: 'person1',
      paragraphDescription: 'Hurry up! Limited time offer.',
      subDescription: 'Women Sportswear Sale',
      adv: '>Hats & Caps, Sunglasses, Bags & much more...',
    },
    {
      imageSrc: '/assets/img/Data/05.jpg',
      imageAlt: 'person2',
      paragraphDescription: 'Complete your look with',
      subDescription: ' New Mens',
      adv: 'Swimwear, Tops, Shorts, Sunglasses & much more...',
    },
  ];
  searchTerm: string = '';
  pageNumber: number = 0;
  showLoadButton = false;
  productDetails: Product[] = [];
  cartDetails: CartDetails[] = [];
  ngOnInit(): void {
    this.searchProduct();

    if (this.userService.forUser.name === null) {
      this.getCartDetails();
    }
  }

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private headerService: HeaderService,
    private wishListService: WishListService
  ) {}

  public getAllProducts() {
    this.productService
      .getProducts(this.pageNumber, this.searchTerm)
      .pipe(
        map((x: Product[], i) =>
          x.map((product: Product) =>
            this.imageProcessingService.createImages(product)
          )
        )
      )
      .subscribe(
        (resp: Product[]) => {
          if (resp.length == 12) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }

          resp.forEach((p) => this.productDetails.push(p));
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  showProductDetails(productId: number) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }
  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
  }
  getCartDetails() {
    this.cartService.getCartDetails().subscribe((resp) => {
      this.cartDetails = resp;
    });
  }
  searchProduct() {
    this.headerService.search.subscribe((reps) => {
      this.searchTerm = reps;
      console.log(this.searchTerm);
      this.pageNumber = 0;
      this.productDetails = [];
      this.getAllProducts();
    });
  }

  addToWishList(productId: number) {
    this.wishListService.productId.next(productId);
    this.wishListService.addNewWishList();
  }
 
}
