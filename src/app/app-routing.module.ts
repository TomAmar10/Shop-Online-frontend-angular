import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { LoginFormComponent } from './components/login-page/login-form/login-form.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/login-page/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { GuestGuardGuard } from './guards/guest-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: AdminPageComponent, pathMatch: 'full' },
  {
    path: 'home',
    component: LoginPageComponent,
    canActivate: [AuthGuardGuard],
    children: [
      { path: '', component: LoginFormComponent, pathMatch: 'full' },
      { path: 'login', component: LoginFormComponent, pathMatch: 'full' },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'shopping/:category',
    canActivate: [GuestGuardGuard],
    component: ShoppingComponent,
    pathMatch: 'full',
  },
  {
    path: 'shopping',
    redirectTo: 'shopping/all',
    pathMatch: 'full',
  },
  { path: 'order', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
