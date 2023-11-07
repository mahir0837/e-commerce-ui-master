import { Component, OnInit } from '@angular/core';
import { Brand } from '../_model/brand-modal';
import { NgForm} from '@angular/forms';
import { BrandService } from '../_services/brand.service';
import { ProductService } from '../_services/product.service';
import { Category } from '../_model/category-modal';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})

export class BrandComponent implements OnInit{
  
  brand :Brand={
    id:0,
    brandName:'',
    categoryId:0
  };
  selectedOption: number = 0;
  categoryArr: Category[] = [];
  constructor(private brandService:BrandService,
    private productService:ProductService){}
  ngOnInit(): void {
    this.getAllCategory();

    }

 
  
  getAllCategory() {
    this.productService.getAllCategories().subscribe(
      (resp) => {
        console.log(resp);
        for (let i = 0; i < resp.length; i++) {
          this.categoryArr[i] = resp[i];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  addBrand(brandForm:NgForm){
  this.brand.categoryId=this.onCategorySelected();
console.log(this.brand.categoryId);

   this.productService.addNewBrand(this.brand).subscribe(resp=>{
   
  this.brand.brandName=resp.brandName; 
  brandForm.reset();
  
  })
  }
  onCategorySelected() {
    return this.selectedOption;
  }
}
