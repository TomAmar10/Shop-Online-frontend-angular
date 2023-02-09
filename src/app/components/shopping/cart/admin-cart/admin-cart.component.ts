import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ItemsService } from 'src/app/services/items.service';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-admin-cart',
  templateUrl: './admin-cart.component.html',
  styleUrls: ['./admin-cart.component.css'],
})
export class AdminCartComponent implements OnInit {
  isEditing = false;
  categories$: Observable<Category[]>;
  itemId: string;
  initialForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    categoryId: new FormControl('1', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });
  itemForm: FormGroup = this.initialForm;

  constructor(
    private itemService: ItemsService,
    private categoryService: CategoriesService,
    private visibleService: VisibilityService
  ) {}

  ngOnInit(): void {
    this.itemService.itemToEdit$.subscribe((item) => {
      if (item) {
        this.itemId = item._id;
        this.isEditing = true;
        this.itemForm = new FormGroup({
          name: new FormControl(item.name, [Validators.required]),
          price: new FormControl(item.price, [Validators.required]),
          categoryId: new FormControl((item.categoryId as any)._id, [
            Validators.required,
          ]),
          image: new FormControl(item.image, [Validators.required]),
        });
        return;
      }
      this.itemForm = this.initialForm;
      this.isEditing = false;
    });
    this.categories$ = this.categoryService.categories$;
  }

  save() {
    if (this.isEditing) {
      this.itemService.EditItem(this.itemForm.value, this.itemId);
    } else this.itemService.addItem(this.itemForm.value);

    this.visibleService.closeCart();
  }

  cancel() {
    this.visibleService.closeCart();
  }
}
