import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  // users$: Observable<User[]>;
  // carts$: Observable<Cart[] | any>;
  users: User[] = [];
  carts: Cart[] | any = [];
  orders: Order[] | any = [];
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((res) => (this.users = res));
    this.cartService.getAllCarts().subscribe((res) => (this.carts = res));
    this.orderService.getAllOrders().subscribe((res) => (this.orders = res));
  }
}
