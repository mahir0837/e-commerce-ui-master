import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref: MatDialogRef<PopupComponent>,private builder:FormBuilder) {}
  ngOnInit(): void {
  
    this.inputData=this.data;
  }

  inputData:any;
  closePopUp() {
    this.ref.close();
  }
  myForm=this.builder.group({
    id:this.builder.control(null),
    categoryName:this.builder.control('')
  })
}
