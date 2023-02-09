import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { VisibilityService } from 'src/app/services/visibilities.service';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  user: User;
  isCartOpen$: Observable<boolean>;
  isAdmin: boolean;
  cartItems$: Observable<Item[]>;
  total$: Observable<number>;

  constructor(
    private userService: UserService,
    private visibleService: VisibilityService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe((res) => {
      if (!res) return;
      this.user = res;
      this.isAdmin = res.role === 1;
    });
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartService.totalPrice$;
    this.isCartOpen$ = this.visibleService.isCartOpen$;
  }

  order() {
    this.router.navigate(['/order']);
  }

  cancel() {
    this.visibleService.closeCart();
  }

  removeAll() {
    this.cartService.removeAllItems();
  }
}
