import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { environment as env } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
// initial actions are in app component
export class UserService {
  private user: User;
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAdminObject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  get user$() {
    return this.userSubject.asObservable();
  }

  get users$() {
    return this.http.get<User[]>(`${env.userUrl}/all`);
  }

  get isAdmin$() {
    return this.isAdminObject.asObservable();
  }

  register(user: User) {
    return this.http.post<User>(`${env.userUrl}/all/register`, user);
  }

  login(user: User) {
    return this.http.post<User>(`${env.userUrl}/all/login`, user);
  }

  setUser(user: User | null) {
    this.userSubject.next(user);
    this.user = user;
    if (!user) {
      localStorage.clear();
      this.isAdminObject.next(false);
      return;
    }
    const isAdmin = user.role === 1;
    this.isAdminObject.next(isAdmin);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.setUser(null);
  }

  checkStorageUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) this.setUser(user);
  }

  getUserDetails() {
    return this.user;
  }

  checkUserId(id: string) {
    return this.http.get<User>(`${env.userUrl}/check-user-id/${id}`);
  }
  checkUserEmail(email: string) {
    return this.http.get<User>(`${env.userUrl}/check-user-email/${email}`);
  }
}
