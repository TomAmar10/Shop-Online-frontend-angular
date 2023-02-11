import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AuthorizationComponent } from './components/login-page/authorization/authorization.component';
import { AboutUsComponent } from './components/login-page/about-us/about-us.component';
import { StoreDetailsComponent } from './components/login-page/store-details/store-details.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { LoginFormComponent } from './components/login-page/login-form/login-form.component';
import { RegisterComponent } from './components/login-page/register/register.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { NavbarComponent } from './components/shopping/navbar/navbar.component';
import { CartComponent } from './components/shopping/cart/cart.component';
import { CartItemComponent } from './components/shopping/cart-item/cart-item.component';
import { ItemsComponent } from './components/shopping/items/items.component';
import { SingleItemComponent } from './components/shopping/single-item/single-item.component';
import { OrderComponent } from './components/order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemPopupComponent } from './components/shopping/item-popup/item-popup.component';
import { OrderPopupComponent } from './components/order/order-popup/order-popup.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { OrderCartComponent } from './components/order/order-cart/order-cart.component';
import { AdminCartComponent } from './components/shopping/cart/admin-cart/admin-cart.component';
import { CartsListComponent } from './components/login-page/carts-list/carts-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoComponent,
    LoginPageComponent,
    AuthorizationComponent,
    AboutUsComponent,
    StoreDetailsComponent,
    LoginFormComponent,
    RegisterComponent,
    ShoppingComponent,
    NavbarComponent,
    CartComponent,
    CartItemComponent,
    ItemsComponent,
    SingleItemComponent,
    OrderComponent,
    ItemPopupComponent,
    OrderPopupComponent,
    ContactComponent,
    AdminPageComponent,
    OrderCartComponent,
    AdminCartComponent,
    CartsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgImageSliderModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
