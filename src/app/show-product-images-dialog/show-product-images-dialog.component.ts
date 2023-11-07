import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHandle } from '../_model/file-handle.model';

@Component({
  selector: 'app-show-product-images-dialog',
  templateUrl: './show-product-images-dialog.component.html',
  styleUrls: ['./show-product-images-dialog.component.scss']
})
export class ShowProductImagesDialogComponent implements OnInit {
  ngOnInit(): void {
    this.receiveImages();
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  receiveImages() {
    console.log(this.data);

  }
}
