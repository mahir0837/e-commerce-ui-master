import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, mapToCanActivate } from '@angular/router';
import { Product } from './_model/product.model';
import { Observable, map } from 'rxjs';
import { ProductService } from './_services/product.service';
import { ImageProcessingService } from './image-processing.service';
import { STRING_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class BuyProductResolverService implements Resolve<Product[]>{

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Product[] | Observable<Product[]> | Promise<Product[]> {
    const id = Number(route.paramMap.get("id"));

    const isSingleProductCheckout = Boolean(route.paramMap.get("isSingleProductChekout"));
    
    return this.productService.getProductDetails(isSingleProductCheckout, id)
      .pipe(
        map(
          (x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product))
         
          )
         
      );




  }
  

}










