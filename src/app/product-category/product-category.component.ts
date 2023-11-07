import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { CartService } from '../_services/cart-service';
import { HeaderService } from '../_services/header.service';
import { WishListService } from '../_services/wishList.service';
import { Product } from '../_model/product.model';
import { CartDetails } from '../_model/cart-details-model';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BrandService } from '../_services/brand.service';
import { Brand } from '../_model/brand-modal';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit{
  selectedSortValue:number=0;
  productBrandId:number=0;
  categoryId:number=0;
  searchTerm: string = '';
  pageNumber: number = 0;
  showLoadButton = false;
  productDetails: Product[] = [];
  brandArr:Brand[]=[];
  cartDetails: CartDetails[] = [];
  ngOnInit(): void {

    this.getAllBrand();
if (this.categoryId!=0) {
  this.searchProduct();
}
 
  this.getCategoryId();
    if (this.userService.forUser.name === null) {
      this.getCartDetails();
    }
  this.getAllProducts();
  }

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private headerService: HeaderService,
    private wishListService:WishListService,
    private brandService:BrandService
  ) {}

  public getAllProducts() {
    this.productService
      .getAllProducts(this.pageNumber, this.searchTerm,this.categoryId,this.productBrandId,this.selectedSortValue)
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
          this.productDetails=[];
          for (let i = 0; i < resp.length; i++) {
           
            if(!this.productDetails.includes(resp[i])){
              
              this.productDetails[i]=resp[i];
             
            }else{
              
            }
            
          }
         
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }
  public getAllProductForCategory(){
    this.productService.getAllProductsBaseOnTheCategory(this.pageNumber, this.searchTerm,this.categoryId) .pipe(
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
        this.productDetails=[];
        for (let i = 0; i < resp.length; i++) {
         
          if(!this.productDetails.includes(resp[i])){
            
            this.productDetails[i]=resp[i];
           
          }else{
            
          }
          
        }
       
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
  getCategoryId(){
    this.headerService.categoryId.subscribe((reps) => {
      this.categoryId = reps;
      this.brandService.categoryId.next(reps);
      this.pageNumber = 0;
      this.productDetails = [];
      this.getAllProducts();
      this.getAllBrand();
      
      
    })   
  }
  addToWishList(productId:number){
   this.wishListService.productId.next(productId);
    this.wishListService.addNewWishList();

  }
  getAllBrand(){
  
  this.brandService.getAllBrand().subscribe(resp=>{
    this.brandArr=resp;
  })
  }
  onCategorySelected(event:number){
    if (event === 0) {
     
     this.getAllProductForCategory();
     this.getAllBrand();
    } else {
      
      this.productBrandId = event;
      this.getAllProducts();
      this.getAllBrand();
    }

    console.log("Selected brand ID: " + this.productBrandId);
   
    
  }
  onSelectedSortValue(event:number){
    this.selectedSortValue=event;
    console.log(this.selectedSortValue);
    this.getAllProducts();
    
  }
}
