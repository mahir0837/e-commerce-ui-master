import {
  Component,
  AfterViewInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details-model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/order.model';

declare var Stripe: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.scss'],
})
export class BuyProductComponent implements AfterViewInit {
  isSingleProductChekout: any = '';
  stripe: any;
  elements: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private roeter: Router,
  ) {}
  ngAfterViewInit(): void {
    this.stripe = Stripe(
      'pk_test_51NR2GTK83yIBaSPaavAFcXFLvfTenmfPZqfCEvetZDdpKa1YX1MuvpKulveC60XsNG13JXrRCNnKiYB0iIFBNElh00x7kKa1sv'
    );
    this.elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    
    var card = this.elements.create('card', { style: style });
    
    card.mount('#card-element');
    
    var card = this.elements.create('card', { style: style });
    // var card = this.elements.create('card');
    card.mount('#card-element');
  }

  productDetails: Product[] = [];
  myOrder!: MyOrderDetails;
  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    paymentMethod: '',
    orderDate:new Date(),
    trackingNumber:'',
    orderProductQuantityList: [],
  };

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];

    this.isSingleProductChekout = this.activatedRoute.snapshot.paramMap.get(
      'isSingleProductChekout'
    );

    this.productDetails.forEach((x) =>
      this.orderDetails.orderProductQuantityList.push({
        productId: x.productId,
        quantity: 1,
      })
    );
    console.log(this.productDetails);

    console.log(this.orderDetails);
  }

  public placeOrder(orderForm: NgForm) {
    this.productService
      .placeOrder(this.orderDetails, this.isSingleProductChekout)
      .subscribe(
        (resp) => {
          console.log(resp);
          orderForm.reset();
          this.roeter.navigate(['/orderConfirm']);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  
  getQoantityForProduct(productId: number) {
    const filterProduct = this.orderDetails.orderProductQuantityList.filter(
      (pq) => pq.productId === productId
    );
    return filterProduct[0].quantity;
  }
  getCalculatedTotal(productId: number, productDiscountedPrice: number) {
    const qty = this.getQoantityForProduct(productId);
    return productDiscountedPrice * qty;
  }
  onQuantityChanged(qty: any, productId: number) {
    this.orderDetails.orderProductQuantityList.filter(
      (p) => p.productId === productId
    )[0].quantity = qty;
  }
  getCalculatedGrandTotal() {
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach((p) => {
      let price = this.productDetails.filter(
        (product) => product.productId === p.productId
      )[0].productDiscountedPrice;
      grandTotal = grandTotal + price * p.quantity;
    });
    return (grandTotal * 1.13).toFixed(2);
  }
  getCalculatedTax() {
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach((p) => {
      const price = this.productDetails.filter(
        (product) => product.productId === p.productId
      )[0].productDiscountedPrice;
      grandTotal = grandTotal + price * p.quantity;
    });
    return ((grandTotal * 13) / 100).toFixed(2);
  }

  createTransectionAndPlaceOrder(orderForm: NgForm) {
    let amount = Number(this.getCalculatedGrandTotal());
    const userName = this.orderDetails.fullName;
    this.stripe
      .createPaymentMethod({
        type: 'card',
        card: this.elements.getElement('card'),
      })
      .then((result: any) => {
        if (result.error) {
          console.error(result.error);
        } else {
          this.productService
            .createTransection(result.paymentMethod.id, userName, amount)
            .subscribe(
              (resp: any) => {
                console.log(resp);
                this.openStripePaymentModal(resp, orderForm);
              },
              (err: any) => {
                console.log(err);
              }
            );
        }
      });
  }

  openStripePaymentModal(response: any, orderForm: NgForm) {
    this.stripe.handleCardPayment(response.clientSecret).then((result: any) => {
      if (result.error) {
        console.error(result.error);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          this.placeOrder(orderForm);
        }
      }
    });
  }
}
