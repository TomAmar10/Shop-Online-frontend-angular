import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-carts-list',
  templateUrl: './carts-list.component.html',
  styleUrls: ['./carts-list.component.css'],
})
export class CartsListComponent implements OnInit {
  carts$: Observable<Cart[]>;
  closedCarts: Cart[] = [];
  openCarts: Cart[] = [];
  clicked = '';
  user: User;

  constructor(
    private cartService: CartService,
    private visibleService: VisibilityService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((res) => (this.user = res));
    this.carts$ = this.cartService.userCarts$;
    this.cartService.isOrderedCarts$.subscribe((carts) => {
      if (!carts) return;
      this.openCarts = carts.filter((c) => !c.isOrdered);
      this.closedCarts = carts.filter((c) => c.isOrdered);
    });
  }

  async goShopping() {
    if (this.clicked) {
      const closedCart = this.closedCarts.find((c) => c._id === this.clicked);
      if (closedCart) this.cartService.createCartFromOrder(closedCart);
      else this.cartService.chooseCartById(this.clicked);
    } else {
      this.cartService.createCart(this.user._id);
    }
    this.visibleService.closePopup();
    this.router.navigate(['/shopping']);
  }

  choose(cartId: string) {
    this.clicked = cartId;
  }
}
