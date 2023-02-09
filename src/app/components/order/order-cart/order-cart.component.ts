import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
} from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.css'],
})
export class OrderCartComponent implements OnInit {
  productSearchSubject = new BehaviorSubject<string>('');
  items$: Observable<Item[]>;
  total$: Observable<number>;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items$ = combineLatest([
      this.productSearchSubject.pipe(debounceTime(300)),
      this.cartService.cartItems$,
    ]).pipe(
      map(([searchWord, list]) =>
        list.filter((w) => w.name.toLowerCase().includes(searchWord))
      )
    );
    this.total$ = this.cartService.totalPrice$;
  }

  searchItem(word: string) {
    this.productSearchSubject.next(word.toLowerCase());
  }
}
