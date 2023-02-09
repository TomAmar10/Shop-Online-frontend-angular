import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);
  private isPopupOpenSubject = new BehaviorSubject<boolean>(false);
  private isContactOpenSubject = new BehaviorSubject<boolean>(false);
  constructor() {}

  get isCartOpen$() {
    return this.isCartOpenSubject.asObservable();
  }

  get isPopupOpen$() {
    return this.isPopupOpenSubject.asObservable();
  }

  get isContactOpen$() {
    return this.isContactOpenSubject.asObservable();
  }

  toggleCart() {
    const lastValue = this.isCartOpenSubject.value;
    this.isCartOpenSubject.next(!lastValue);
  }
  openCart() {
    this.isCartOpenSubject.next(true);
  }
  closeCart() {
    this.isCartOpenSubject.next(false);
  }

  openPopup() {
    this.isPopupOpenSubject.next(true);
  }
  closePopup() {
    this.isPopupOpenSubject.next(false);
  }

  openContact() {
    this.isContactOpenSubject.next(true);
  }

  closeContact() {
    this.isContactOpenSubject.next(false);
  }
}
