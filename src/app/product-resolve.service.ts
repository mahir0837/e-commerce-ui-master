import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from './_model/product.model';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './_services/product.service';
import { ImageProcessingService } from './image-processing.service';
import { Category } from './_model/category-modal';

@Injectable({
  providedIn: 'root'
})
export class ProductResolveService implements Resolve<Product>{

  category:Category | undefined;
  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const idParam=route.paramMap.get("productId");
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id) {
      return this.productService.getProductDetailById(id)
        .pipe(
          map(p =>this.imageProcessingService.createImages(p))
        );
    }
    else {
      return of(this.getProductDetails());
    }
  }

  getProductDetails() {
    return {
      productId:0,
      productName: "",
      productDescription: "",
      productDiscountedPrice: 0,
      productActualPrice: 0,
      productCategory:0,
      productBrand:0,
      productImages: []
    };
  }

}
