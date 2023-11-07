import { Injectable } from '@angular/core';
import { Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripe!: Stripe;

  constructor() {
    this.initializeStripe();
  }

  async initializeStripe() {
    
  }
}