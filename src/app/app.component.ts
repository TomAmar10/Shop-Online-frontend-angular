import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from './services/cart.service';
import { CategoriesService } from './services/categories.service';
import { ItemsService } from './services/items.service';
import { UserService } from './services/user.service';
import { VisibilityService } from './services/visibilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isContactOpen$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private categoryService: CategoriesService,
    private itemService: ItemsService,
    private visibleService: VisibilityService
  ) {}

  ngOnInit(): void {
    this.userService.checkStorageUser();
    this.cartService.checkStorageCart();
    this.userService.user$.subscribe((u) => {
      if (u) this.cartService.setAllUserCarts(u._id);
      else this.cartService.clearCarts();
    });
    this.itemService.setAll();
    this.categoryService.setCategories();
    this.isContactOpen$ = this.visibleService.isContactOpen$;
  }
}
