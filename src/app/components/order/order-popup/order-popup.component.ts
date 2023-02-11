import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { environment as env } from 'src/app/environments/environment';
import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.css'],
})
export class OrderPopupComponent implements OnInit {
  isSucceeded$: Observable<boolean>;
  order: Order;
  recipeLink = '';
  isLoading = false;
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isSucceeded$ = this.orderService.isSucceeded$;
    this.orderService.order$.subscribe((res) => {
      this.isLoading = false;
      if (!res) return;
      this.order = res;
      this.recipeLink = `${env.orderUrl}/single/recipe/${res._id}`;
    });
  }

  download() {
    this.orderService.download(this.recipeLink).subscribe((res) => {
      let fileName = 'recipe.html';

      let blob: Blob = res.body as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
  }

  close() {
    this.orderService.setOrderComplete();
    this.cartService.setEmptyCart();
    this.router.navigate(['/shopping']);
  }
}
