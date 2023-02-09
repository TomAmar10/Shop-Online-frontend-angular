import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuardGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private cartService:CartService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.getUserDetails()
      ? true
      : this.router.navigate(['/home/login']);
  }
}
