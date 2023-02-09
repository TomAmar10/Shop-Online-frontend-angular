import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  items$: Observable<Item[]>;
  constructor(private itemService: ItemsService) {}

  ngOnInit(): void {
    this.items$ = this.itemService.items$;
  }
}
