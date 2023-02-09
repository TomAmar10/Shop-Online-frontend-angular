import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {
  isPopupOpen$: Observable<boolean>;
  constructor(private visibleService: VisibilityService) {}

  ngOnInit(): void {
    this.isPopupOpen$ = this.visibleService.isPopupOpen$;
  }
}
