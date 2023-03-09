import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment as env } from '../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private isCompleteSubject = new BehaviorSubject<boolean>(false);
  private isSucceededSubject = new BehaviorSubject<boolean>(false);
  private orderSubject = new BehaviorSubject<Order | null>(null);

  constructor(private http: HttpClient) {}

  get order$() {
    return this.orderSubject.asObservable();
  }

  getOrderedCarts() {
    return this.http
      .get<Order[]>(`${env.orderUrl}/all`)
      .pipe(map((o) => o.map((order) => (order.cartId as any)._id)));
  }

  get isComplete$() {
    return this.isCompleteSubject.asObservable();
  }

  get isSucceeded$() {
    return this.isSucceededSubject.asObservable();
  }

  getOrderDates() {
    return this.getAllOrders().pipe(
      map((orders) => orders.map((o) => o.delivery))
    );
  }

  getAllOrders() {
    return this.http.get<Order[]>(`${env.orderUrl}/all`);
  }

  getCities() {
    return this.http
      .get<any>(
        'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=1300'
      )
      .pipe(
        map((list) => list.result.records.map((item) => item.שם_ישוב.trim()))
      );
  }

  getStreets(city: string) {
    return this.http
      .get<any>(
        `https://data.gov.il/api/3/action/datastore_search?resource_id=a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3&q=${city}&limit=1300`
      )
      .pipe(
        map((list) => list.result.records.map((item) => item.שם_רחוב.trim()))
      );
  }

  order(order: any) {
    this.isSucceededSubject.next(true);
    this.http.post<Order>(`${env.orderUrl}/all/add`, order).subscribe(
      (res) => this.orderSubject.next(res),
      (error) => this.isSucceededSubject.next(false)
    );
    this.isCompleteSubject.next(true);
  }

  setOrderComplete() {
    this.isCompleteSubject.next(!this.isCompleteSubject.value);
  }

  download(url: string) {
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }
}
