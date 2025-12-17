// app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { BlankLayout } from './layouts/blank-layout/blank-layout';

export const routes: Routes = [
  // Routes không có header/footer (fullscreen)
  {
    path: 'login',
    component: BlankLayout,
    children: [
      { path: '', component: Login },
    ]
  },
  // Routes với header/footer
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
    ]
  },
  { path: '**', redirectTo: '' }
];