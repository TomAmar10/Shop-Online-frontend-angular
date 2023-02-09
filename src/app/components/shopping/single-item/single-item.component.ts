import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { VisibilityService } from 'src/app/services/visibilities.service';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.css'],
})
export class SingleItemComponent implements OnInit {
  @Input() item: Item;
  isAdmin: boolean;

  constructor(
    private itemService: ItemsService,
    private cartService: CartService,
    private visibleService: VisibilityService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isAdmin$.subscribe((res) => (this.isAdmin = res));
  }

  itemClick() {
    if (this.isAdmin) {
      this.itemService.setItemToEdit(this.item);
      this.visibleService.openCart();
    } else {
      this.cartService.setItemToCart(this.item);
      this.visibleService.openPopup();
    }
  }
}
