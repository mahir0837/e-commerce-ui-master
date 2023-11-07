import { Component, NgModule, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { MyOrderDetails } from '../_model/order.model';
import { ProductService } from '../_services/product.service';
import { FormBuilder, FormGroup,FormsModule } from '@angular/forms';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  status:string='All';
  
    ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }
  
  dataSource: MyOrderDetails[] = [];
  displayedColumns: string[] = ['Id', 'Product Name', 'Name', 'Address', 'Contact No', 'Status', 'Action','Add Days'];

  constructor(private productService: ProductService) { }
  increment(element: any) {

    element.addedDays++;
    
  }
  decrement(element: any) {
    
    if (element.addedDays > 0) {
      element.addedDays--;
    }
  }
  getAllOrderDetailsForAdmin(statusParameter:string) {
    this.productService.getAllOrderDetailsForAdmin(statusParameter).subscribe(
      (resp) => {
                this.dataSource = resp;
                this.dataSource.forEach((element) => {
                  element.addedDays =" 0";
                });
        console.log(resp);
      
      }, (err) => {
        console.log(err);

      }
    );
  }
  markAsDelivered(orderId: number,addedDays:string) {
    let addedDaysNumber: number = parseInt(addedDays);
    this.productService.markOrderAsDelivered(orderId,addedDaysNumber).subscribe(
      (resp)=>{
        this.getAllOrderDetailsForAdmin(this.status);
        console.log(resp);
      
        
      },(err)=>{
        console.log(err);

      }
    );
  }
  markAsProcessing(orderId: number,addedDays:string) {
    let addedDaysNumber: number = parseInt(addedDays);
    this.productService.markOrderAsProcessing(orderId,addedDaysNumber).subscribe(
      (resp)=>{
        this.getAllOrderDetailsForAdmin(this.status);
        console.log(resp);
      
        
      },(err)=>{
        console.log(err);

      }
    );
  }
  markAsQualityCheck(orderId: number,addedDays:string) {
    let addedDaysNumber: number = parseInt(addedDays);
    this.productService.markOrderAsQualityCheck(orderId,addedDaysNumber).subscribe(
      (resp)=>{
        this.getAllOrderDetailsForAdmin(this.status);
        console.log(resp);
      
        
      },(err)=>{
        console.log(err);
      
      }
    );
  }

 
}
