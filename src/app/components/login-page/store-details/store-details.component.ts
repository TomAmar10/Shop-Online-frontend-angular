import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { ItemsService } from 'src/app/services/items.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css'],
})
export class StoreDetailsComponent implements OnInit {
  items$: Observable<Item[]>;
  ordersCount: number;
  user: User;
  message: string = '';
  speed = 0.5;
  size = { width: 142, height: 130 };
  imageObject: Array<object> = [
    {
      image: '../../../../assets/images/details-item1.jpg',
      thumbImage: '../../../../assets/images/details-item1.jpg',
      alt: '...',
    },
    {
      image: '../../../../assets/images/details-item2.jpg',
      thumbImage: '../../../../assets/images/details-item2.jpg',
      alt: '...',
    },
    {
      image: '../../../../assets/images/details-item3.jpg',
      thumbImage: '../../../../assets/images/details-item3.jpg',
      alt: '...',
    },
  ];

  constructor(
    private itemService: ItemsService,
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((u) => (this.user = u));
    this.orderService
      .getAllOrders()
      .subscribe((res) => (this.ordersCount = res.length));
    this.items$ = this.itemService.items$;
    this.cartService.isOrderedCarts$.subscribe((carts) => {
      if (!this.user) return;
      if (!carts.length) {
        this.message = `Welcome ${this.user.first_name} !`;
        return;
      }
      const open = carts.filter((c) => !c.isOrdered);
      const close = carts.filter((c) => c.isOrdered);
      this.message = open.length
        ? `You have an open cart from ${this.getDate(open)}`
        : `Your last order was on ${this.getDate(close)}`;
    });
  }

  getDate(arr: Cart[]) {
    return new Date(arr[arr.length - 1].created).toLocaleDateString();
  }
}
