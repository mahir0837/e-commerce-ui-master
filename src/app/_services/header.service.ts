import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
 public search=new BehaviorSubject<string>("");
 public categoryId=new BehaviorSubject<number>(0);

 
  constructor() { }


}
