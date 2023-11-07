import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject } from 'rxjs';
import { Brand } from '../_model/brand-modal';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brand1:Brand={
    id:0,
    brandName:'',
    categoryId:0
  }
  public brand=new BehaviorSubject<Brand>(this.brand1);
  public categoryId=new BehaviorSubject<number>(0);
  public categoryIdForBrand=new BehaviorSubject<number>(0);
  public brandArr=new BehaviorSubject<Brand[]>([]);
  constructor(private productService:ProductService) { }

  getAllBrand(){
    this.productService.getAllBrand(this.categoryId.value).subscribe(resp=>{
      this.brandArr.next(resp);
      console.log(this.categoryId.value);
      
    });
    return this.brandArr.asObservable();
  }

  addBrand(){
    this.productService.addNewBrand(this.brand1).subscribe(resp=>{
      this.brand.next(resp);
      console.log(resp);
      
    });
  }
 
}