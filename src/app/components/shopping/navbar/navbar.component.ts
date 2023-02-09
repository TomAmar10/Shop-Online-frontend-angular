import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { VisibilityService } from 'src/app/services/visibilities.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  categories$: Observable<Category[]>;
  isCartOpen$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  plusImg = '../../../../assets/images/add.png';
  cartImg = '../../../../assets/images/cart.png';

  constructor(
    private visibleService: VisibilityService,
    private userService: UserService,
    private itemService: ItemsService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isCartOpen$ = this.visibleService.isCartOpen$;
    this.isAdmin$ = this.userService.isAdmin$;
    this.categories$ = this.categoryService.categories$;

    this.route.params.subscribe((p) =>
      this.itemService.setByCategory(p['category'])
    );
  }

  toggleCart() {
    this.itemService.setItemToEdit(null);
    this.visibleService.toggleCart();
  }

  navigate(event: Event) {
    const target = (event.target as HTMLInputElement).value;
    this.itemService.setByCategory(target);
  }
}
