import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsService } from 'src/app/services/items.service';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  isPopupOpen$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  constructor(
    private visibleService: VisibilityService,
    private itemService: ItemsService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.itemService.isLoading$;
    this.isPopupOpen$ = this.visibleService.isPopupOpen$;
  }
}
