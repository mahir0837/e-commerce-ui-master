import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderService } from '../_services/header.service';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.scss'],
})
export class ShowProductDetailsComponent implements OnInit {
  
  searchkeyword: string = '';
  productDetails: Product[] = [];
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'description',
    'Product Discounted Price',
    'Product Actual Price',
    'Actions',
  ];
  showLoadMoreProduct = false;
  showTable = false;
  pageNumber: number = 0;
  ngOnInit(): void {
   
    this.getAllProducts();
    this.searchByKeyword();
  }

  constructor(
    private productService: ProductService,
    private imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private headerService: HeaderService,
    
  ) {}

  public getAllProducts() {
    this.showTable = false;
    this.productService
      .getProducts(this.pageNumber, this.searchkeyword)
      .pipe(
        map((x: Product[], i) =>
          x.map((product: Product) =>
            this.imageProcessingService.createImages(product)
          )
        )
      )
      .subscribe(
        (resp: Product[]) => {
          resp.forEach((p) => this.productDetails.push(p));
          this.showTable = true;
          console.log(this.productDetails);
          if (resp.length == 4) {
            this.showLoadMoreProduct = true;
          } else {
            this.showLoadMoreProduct = false;
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }
  deleteProduct(productId: any) {
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        this.getAllProducts();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
  showImages(product: Product) {
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent, {
      data: {
        images: product.productImages,
      },
      height: '500px',
      width: '800px',
    });
  }
  editProductDetails(productId: number) {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }
  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }
  searchByKeyword() {
    this.headerService.search.subscribe((resp) => {
      this.searchkeyword = resp;
      console.log(this.searchkeyword);
      this.pageNumber = 0;
      this.productDetails = [];
      this.getAllProducts();
    });
  }
 
  }

