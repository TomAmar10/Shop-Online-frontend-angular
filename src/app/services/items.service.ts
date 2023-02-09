import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../models/item.model';
import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemsService implements OnInit {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  private allItemsSubject = new BehaviorSubject<Item[]>([]);
  private itemToEditSubject = new BehaviorSubject<Item | null>(null);
  private isSearchingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  setAll() {
    this.http.get<Item[]>(`${env.itemUrl}/all`).subscribe((res) => {
      this.itemsSubject.next(res);
      this.allItemsSubject.next(res);
    });
  }

  get items$() {
    return this.itemsSubject.asObservable();
  }
  get allItems$() {
    return this.allItemsSubject.asObservable();
  }

  get itemToEdit$() {
    return this.itemToEditSubject.asObservable();
  }

  addItem(item: Item) {
    this.http.post<Item>(`${env.itemUrl}/all/add`, item).subscribe((res) => {
      this.setAll();
      return res;
    });
  }

  EditItem(item: Item, id: string) {
    this.http
      .patch<Item>(`${env.itemUrl}/all/update/${id}`, item)
      .subscribe((res) => {
        this.setAll();
        return res;
      });
  }

  setItemToEdit(item: Item) {
    this.itemToEditSubject.next(item);
  }

  setByCategory(name: string) {
    if (['all', 'All'].includes(name)) {
      this.setAll();
      return;
    }

    const newItems = this.allItemsSubject.value.filter(
      (i) => (i.categoryId as any).name === name
    );
    this.itemsSubject.next(newItems);
  }

  search(name: string) {
    if (!name) return;

    const searched = this.allItemsSubject.value.filter((i) =>
      i.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!searched) return;
    this.itemsSubject.next(searched);
    this.isSearchingSubject.next(true);
  }
}
