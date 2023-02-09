import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { environment as env } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  setCategories() {
    this.http.get<Category[]>(`${env.categoryUrl}/all`).subscribe((res) => {
      this.categoriesSubject.next(res);
    });
  }

  get categories$() {
    return this.categoriesSubject.asObservable();
  }

  getCategories() {
    return this.categoriesSubject.value;
  }
}
