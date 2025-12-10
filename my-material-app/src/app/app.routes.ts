import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { LoginComponent } from './pages/authenticate/login/login.component';
import { RegisterComponent } from './pages/authenticate/register/register.component';
import { ForgotPasswordComponent } from './pages/authenticate/forgot-password/forgot-password.component';
import { HomepageComponent } from './pages/main/homepage/homepage.component';
import { ProductsComponent } from './pages/main/products/products.component';
import { OrdersComponent } from './pages/main/orders/orders.component';
import { CustomerComponent } from './pages/main/customer/customer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ]
  },
  {
    path: 'main',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomepageComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customer', component: CustomerComponent },
    ]
  },
  { path: '**', redirectTo: '/auth/login' }
];
