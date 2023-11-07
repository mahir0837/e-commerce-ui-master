import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { NgForm } from '@angular/forms';
import { Category } from '../_model/category-modal';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  category: Category = {
    id: 0,
    categoryName: '',
  };
  categoryArr: Category[] = [];
  displayedColumns: string[] = ['Id', 'Category Name', 'Action'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  addCategory(categoryForm: NgForm) {
    this.productService
      .addCategory(this.category)
      .subscribe((resp: Category) => {
        categoryForm.reset();
        this.category = resp;
        this.getAllCategories();
      });
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe((resp) => {
      this.categoryArr = resp;
    });
  }
  editProductDetails(categoryId: number) {
    this.router.navigate(['/addNewCategory', { categoryId: categoryId }]);
  }

  openPopUp() {
    var _popup = this.dialog.open(PopupComponent, {
      width: '40%',
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '600ms',
      data: {
        title: 'Category Edit',
      },
    });
    _popup.afterClosed().subscribe((item) => {});
  }
  deleteProduct(id: number) {
    this.productService.deleteCategory(id).subscribe((resp) => {});
    window.location.reload();
  }
}
