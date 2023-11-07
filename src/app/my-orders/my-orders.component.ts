import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/order.model';
import { ImageProcessingService } from '../image-processing.service';
import { OrderDetails } from '../_model/order-details-model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  ngOnInit(): void {
    this.getOrderDetails();
  
    }
  
    displayedColumns: string[] = ['Name', 'Address', 'Contact No', 'Amount','Status'];
    myOrderDetails:MyOrderDetails[]=[];
    orderDetails:OrderDetails[]=[];

  constructor(private productService:ProductService,
    private imageProcessingService:ImageProcessingService) {  }

  getOrderDetails(){
    this.productService.getOrderDetails().subscribe(
      (resp:MyOrderDetails[])=>{
        
        this.myOrderDetails=resp;
        console.log(resp);
        this.myOrderDetails.forEach((c) =>
        this.imageProcessingService.createImages(c.product)
      );
        
      },(err)=>{
        console.log(err);
        
      }
    );
  }
 
}
