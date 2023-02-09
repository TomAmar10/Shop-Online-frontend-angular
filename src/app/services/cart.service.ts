import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { environment as env } from '../environments/environment';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Item } from '../models/item.model';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
// initial actions are in app component
export class CartService {
  private totalPrice: number;
  private allUserCartsSubject = new BehaviorSubject<Cart[]>([]);
  private currCartSubject = new BehaviorSubject<Cart>(null);
  private itemToCartSubject = new BehaviorSubject<Item | null>(null);
  private totalPriceSubject = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient, private orderService: OrderService) {}

  get userCarts$() {
    return this.allUserCartsSubject.asObservable();
  }

  get isOrderedCarts$() {
    return combineLatest([
      this.userCarts$,
      this.orderService.getOrderedCarts(),
    ]).pipe(
      map(([carts, ordered]) => {
        carts.forEach((cart) => (cart.isOrdered = ordered.includes(cart._id)));
        return carts;
      })
    );
  }

  get itemToCart$() {
    return this.itemToCartSubject.asObservable();
  }

  get cartItems$() {
    return this.currCartSubject.asObservable().pipe(
      map((cart) => {
        if (!cart) return [];
        return cart.items.reduce((acc, curr) => {
          const existingItem = acc.find((item) => item._id === curr._id);
          if (existingItem) existingItem.amount++;
          else {
            curr.amount = 1;
            acc.push(curr);
          }
          return acc;
        }, []);
      })
    );
  }

  get totalPrice$() {
    return this.totalPriceSubject.asObservable();
  }

  getCurrCart() {
    return this.currCartSubject.value;
  }

  getTotal() {
    return this.totalPrice;
  }

  getAllCarts() {
    return this.http.get<Cart[]>(`${env.cartUrl}/all`);
  }

  checkStorageCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
      this.currCartSubject.next(cart);
      this.setTotalPrice();
    }
  }

  createCartFromOrder(cart: Cart) {
    this.http
      .post<Cart>(`${env.cartUrl}/all/add`, {
        userId: (cart.userId as any)._id,
        items: cart.items,
      })
      .subscribe((res) => this.setCurrentCart(res));
  }

  setTotalPrice() {
    this.cartItems$.subscribe((items) => {
      let sum = 0;
      items.map((i) => (sum += +i.price * +i.amount));
      this.totalPriceSubject.next(+sum.toFixed(2));
      this.totalPrice = +sum.toFixed(2);
    });
  }

  setAllUserCarts(userId: string) {
    this.http
      .get<Cart[]>(`${env.cartUrl}/all/by-user/${userId}`)
      .subscribe((res) => this.allUserCartsSubject.next(res));
  }

  createCart(userId: string) {
    this.http
      .post<Cart>(`${env.cartUrl}/all/add`, { userId })
      .subscribe((cart) => this.setCurrentCart(cart));
  }

  clearCarts() {
    this.allUserCartsSubject.next([]);
    this.currCartSubject.next(null);
  }

  chooseCartById(id: string) {
    const cart = this.allUserCartsSubject.value.find((c) => c._id === id);
    this.setCurrentCart(cart);
  }

  setCurrentCart(cart: Cart) {
    this.currCartSubject.next(cart);
    this.setAllUserCarts((cart.userId as any)._id || cart.userId);
    this.setTotalPrice();
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  setItemToCart(item: Item) {
    this.itemToCartSubject.next(item);
  }

  addItemToCart(amount: number) {
    const cart = this.currCartSubject.value;
    const items = cart.items;

    for (let i = 0; i < amount; i++) {
      items.push(this.itemToCartSubject.value);
    }
    cart.items = items;
    this.http
      .patch<Cart>(`${env.cartUrl}/all/update/${cart._id}`, { items })
      .subscribe();
    this.setCurrentCart(cart);
  }

  removeItem(itemId: string) {
    const cart = this.currCartSubject.value;
    const items = [...cart.items];
    const idx = items.findIndex((i) => i._id === itemId);
    items.splice(idx, 1);
    cart.items = items;
    this.setCurrentCart(cart);
    this.http
      .patch<Cart>(`${env.cartUrl}/all/update/${cart._id}`, { items })
      .subscribe();
  }

  removeAllItems() {
    const cart = this.currCartSubject.value;
    cart.items = [];
    this.setCurrentCart(cart);
    this.http
      .patch<Cart>(`${env.cartUrl}/all/update/${cart._id}`, {
        items: [],
      })
      .subscribe();
  }
}
