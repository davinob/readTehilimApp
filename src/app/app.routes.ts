import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'read-tehilim',
    loadComponent: () => import('./read-tehilim/read-tehilim.page').then((m) => m.ReadTehilimPage),
  },
  {
    path: 'read-history',
    loadComponent: () => import('./read-history/read-history.page').then((m) => m.ReadHistoryPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
