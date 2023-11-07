import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileHandle } from '../_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../_model/category-modal';
import { BrandService } from '../_services/brand.service';
import { Brand } from '../_model/brand-modal';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent implements OnInit {
  selectedBrand = 1;
  selectedOption: number = 1;
  categoryArr: Category[] = [];
  brandArr: Brand[] = [];
  isNewProduct = true;
  productForm!: FormGroup;
  product: Product = {
    productId: 0,
    productName: '',
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0,
    productCategory: 0,
    productBrand: 0,
    productImages: [],
  };

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      productDiscountedPrice: [null, Validators.required],
      productActualPrice: [null, Validators.required],
      
    });
    this.onCategorySelected(this.selectedOption);
    this.getAllCategory();
    this.getAllBrand();
    this.product = this.activatedRoute.snapshot.data['product'];
    if (this.product && this.product.productId) {
      this.isNewProduct = false;
    }
  }

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private brandService: BrandService
  ) {}

  addProduct() {
    this.product.productCategory = this.selectedOption;
    this.product.productBrand = this.selectedBrand;
    this.product.productName = this.productForm.value.productName;
    this.product.productDescription =this.productForm.value.productDescription;
    this.product.productActualPrice = this.productForm.value.productActualPrice;
    this.product.productDiscountedPrice =
    this.productForm.value.productDiscountedPrice;
    console.log(this.selectedBrand);
    const productFormData = this.prepareFormData(this.product);
    if (this.productForm.valid) {
      this.productService.addProduct(productFormData).subscribe(
        (response: Product) => {
        
          
          this.productForm.reset();
          this.product.productImages = [];
          console.log('Product added successfully:', response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    } else {
      this.validateAllFormFields(this.productForm);
      alert('Your Form is invalid');
    }
  }
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((f) => {
      const control = formGroup.get(f);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();

    formData.append(
      'product',
      new Blob([JSON.stringify(product)], { type: 'application/json' })
    );
    for (let i = 0; i < product.productImages.length; i++) {
      formData.append(
        'imageFile',
        product.productImages[i].file,
        product.productImages[i].file.name
      );
    }
    formData.append(
      'productCategory',
      new Blob([JSON.stringify(this.selectedOption)], {
        type: 'application/json',
      })
    );
    return formData;
  }
  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        ),
      };
      this.product.productImages.push(fileHandle);
    }
  }

  removeImages(i: number) {
    this.product.productImages.splice(i, 1);
  }
  fileDropped(fileHandle: FileHandle) {
    this.product.productImages.push(fileHandle);
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
  onCategorySelected(selectedOption: number): any {
    this.selectedOption = selectedOption;
    this.brandService.categoryId.next(this.selectedOption);
    this.getAllBrand();
  }
  getAllBrand() {
    this.brandService.getAllBrand().subscribe((resp) => {
      this.brandArr = resp;
    });
  }
  onBrandSelected(selectedBrand: number) {
    this.selectedBrand= selectedBrand;
  }
}
