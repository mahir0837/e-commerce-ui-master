import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { ProductService } from '../_services/product.service';
import { CartDetails } from '../_model/cart-details-model';
import { Category } from '../_model/category-modal';
import { ImageProcessingService } from '../image-processing.service';
import { CartService } from '../_services/cart-service';
import { HeaderService } from '../_services/header.service';
import { WishListService } from '../_services/wishList.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  @ViewChild('signinModal')
  signinModal!: ElementRef;
  categoryId: number = 0;
  wishListNumber: number = 0;
  totalItem: number = 0;
  totalAmount: number = 0;
  cart: CartDetails[] = [];
  categoryList: Category[] = [];
  searchTerm: string = '';

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private headerService: HeaderService,
    private imageProcessingService: ImageProcessingService,
    private wishListService: WishListService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.signUpForm = this.formBuilder.group({
      userFirstName: ['', [Validators.required, Validators.minLength(3)]],
      userLastName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      userConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.productService.refresh.subscribe((resp) => {
      this.getCartDetails();
    });
    this.getWishListNumber();
    this.getCartDetails();
    this.getAllCategories();
  }
  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logOut() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  public isAdmin(): boolean {
    if (this.userAuthService.isAdmin()) {
      return true;
    } else {
      return false;
    }
  }

  public isUser(): boolean {
    if (this.userAuthService.isUser()) {
      return true;
    } else {
      return false;
    }
  }

  getCartDetails() {
    this.cartService.getCartDetails().subscribe((resp) => {
      this.cart = resp;
      console.log(resp);
      this.cart.forEach((c) =>
        this.imageProcessingService.createImages(c.product)
      );
      this.totalItem = resp.length;
      this.totalAmount = resp.reduce((amount, item) => {
        return amount + item.product.productDiscountedPrice;
      }, 0);
    });
  }
  removeItem(cartId: number) {
    this.cartService.removeItem(cartId);
    this.getCartDetails();
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe((resp) => {
      this.categoryList = resp;
    });
  }
  showProductDetails(productId: number) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  searchByKeyword(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.headerService.search.next(this.searchTerm);
  }

  onCategorySelected(event: number) {
    this.categoryId = event;
    this.headerService.categoryId.next(this.categoryId);
  }
  getWishListNumber() {
    this.wishListService.wishListSize.subscribe((resp) => {
      this.wishListNumber = resp;
      console.log(this.wishListNumber);
    });
  }
  login() {
    const userData = this.signInForm.value;

    if (this.signInForm.valid) {
      this.userService.login(userData).subscribe(
        (response: any) => {
          this.router.navigate(['/orderInformation']);
          console.log(response.jwtToken);
          console.log(response.user.role);
          this.userAuthService.setRoles(response.user.role);

          this.userAuthService.setToken(response.jwtToken);

          this.closeSignInModal();
          window.location.reload();

          const role = response.user.role[0].roleName;
          if (role === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['user']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.validateAllFormFields(this.signInForm);
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

  getUSerDetails() {
    const userData = this.signInForm.value;
    this.productService.getUserDetails(userData.userName).subscribe((resp) => {
      userData.userName = resp.userName;
    });
  }

  closeSignInModal() {
    this.signinModal.nativeElement.style.display = 'none';
  }
  register() {
    const userData = this.signUpForm.value;
    if (this.signUpForm.valid) {
      this.userService.register(userData).subscribe(
        (resp) => {
          this.router.navigate(['/']);
          this.closeSignInModal();
          window.location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.validateAllFormFields(this.signUpForm);

      alert('Yor Form is not valid');
    }
  }
}
