import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  public orderDate: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  constructor() { }
}
