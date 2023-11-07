import { Product } from './product.model';

export interface WishList {
  id: number;
  product: Product;
  user: any;
}
