import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  map,
  Observable,
} from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  styles: [
    `
      .marked-date {
        background-color: yellow;
      }
    `,
  ],
})
export class OrderComponent implements OnInit {
  citySearchSubject = new BehaviorSubject<string>('');
  streetSearchSubject = new BehaviorSubject<string>('');
  error = '';
  cities$: Observable<string[]>;
  streets$: Observable<string[]>;
  isComplete$: Observable<boolean>;
  isFirstStep = true;
  isCityDirty: boolean;
  isStreetDirty: boolean;
  user: User;
  orderDates: Date[] = [];
  private clicks = 0;
  private timer: any;
  order_details: FormGroup = new FormGroup({
    city: new FormControl('', [Validators.required, Validators.minLength(2)]),
    street: new FormControl('', [Validators.required, Validators.minLength(2)]),
    delivery: new FormControl('', [
      Validators.required,
      this.checkDelivery.bind(this),
    ]),
  });
  order_payment: FormGroup = new FormGroup({
    credit: new FormControl('', [
      Validators.required,
      Validators.min(1000000000000000),
      Validators.max(10000000000000000),
    ]),
    expiration: new FormControl('', [
      Validators.required,
      this.checkExpiry.bind(this),
    ]),
    digits: new FormControl('', [
      Validators.required,
      Validators.max(999),
      Validators.min(100),
    ]),
  });

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderService.getOrderDates().subscribe(
      (res) => (this.orderDates = res.map((o) => new Date(o)))
    );
    this.user = this.userService.getUserDetails();
    this.cities$ = combineLatest([
      this.citySearchSubject.pipe(debounceTime(300)),
      this.orderService.getCities(),
    ]).pipe(
      map(([searchWord, list]) =>
        list.filter((w, i) => w.includes(searchWord) && i !== 0)
      )
    );
    this.isComplete$ = this.orderService.isComplete$;
  }

  order() {
    if (this.order_payment.invalid) {
      this.order_payment.markAllAsTouched();
      return;
    }
    const order = {
      userId: this.user._id,
      cartId: this.cartService.getCurrCart()._id,
      price: this.cartService.getTotal(),
      ...this.order_details.value,
      digits: Math.floor(this.order_payment.value.credit % 10000),
    };
    this.orderService.order(order);
  }

  goToPayment() {
    if (this.order_details.invalid) {
      this.order_details.markAllAsTouched();
      return;
    }
    this.isFirstStep = false;
  }

  checkClick() {
    this.clicks++;
    if (this.clicks === 1) {
      this.timer = setTimeout(() => {
        this.clicks = 0;
      }, 300);
      return;
    }
    clearTimeout(this.timer);
    this.clicks = 0;
    this.order_details.patchValue({
      city: this.user.city,
      street: this.user.street,
    });
  }

  searchCity(city: string) {
    this.citySearchSubject.next(city);
    this.isCityDirty = city.length > 0;
  }

  searchStreet(street: string) {
    this.streetSearchSubject.next(street);
    this.isStreetDirty = street.length > 0;
  }

  chooseCity(city: string) {
    this.order_details.patchValue({
      city,
    });
    this.isCityDirty = false;
    this.streets$ = combineLatest([
      this.streetSearchSubject.pipe(debounceTime(300)),
      this.orderService.getStreets(city),
    ]).pipe(
      map(([searchWord, list]) =>
        list.filter((w, i) => w.includes(searchWord) && i !== 0)
      )
    );
  }
  chooseStreet(street: string) {
    this.order_details.patchValue({
      street,
    });
    this.isStreetDirty = false;
  }

  checkValid1(control: string) {
    return (
      this.order_details.get(control).touched &&
      this.order_details.get(control).invalid
    );
  }
  checkValid2(control: string) {
    return (
      this.order_payment.get(control).touched &&
      this.order_payment.get(control).invalid
    );
  }

  checkDelivery(control: FormControl) {
    let count = 0;
    this.orderDates.forEach((o) => {
      if (o.getTime() === new Date(control.value).getTime()) count++;
    });
    const isTooEarly = new Date(control.value).getTime() < new Date().getTime();
    return count > 2 || isTooEarly ? { unAvailable: true } : null;
  }
  checkExpiry(control: FormControl) {
    const isTooEarly = new Date(control.value).getTime() < new Date().getTime();
    return isTooEarly ? { unAvailable: true } : null;
  }
}
