import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { Item } from 'src/app/models/item.model';
import { CartService } from 'src/app/services/cart.service';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-popup',
  templateUrl: './item-popup.component.html',
  styleUrls: ['./item-popup.component.css'],
})
export class ItemPopupComponent implements OnInit {
  item$: Observable<Item>;
  cart: Cart;
  amount = 1;

  constructor(
    private cartService: CartService,
    private visibleService: VisibilityService
  ) {}

  ngOnInit(): void {
    this.item$ = this.cartService.itemToCart$;
    this.cart = this.cartService.getCurrCart();
  }

  plus() {
    this.amount++;
  }
  minus() {
    this.amount--;
  }

  save() {
    if (this.amount < 1) return;
    this.cartService.addItemToCart(this.amount);
    this.visibleService.closePopup();
  }

  close() {
    this.visibleService.closePopup();
  }
}
