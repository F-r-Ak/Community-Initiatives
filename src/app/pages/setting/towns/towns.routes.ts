import { Routes } from '@angular/router';

export const townsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/towns/towns.component').then(c => c.TownsComponent),
    data: { pageTitle: 'المدن', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-town/add-edit-town.component').then(c => c.AddEditTownComponent),

    data: { pageTitle: 'اضافة مدينة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-town/add-edit-town.component').then(c => c.AddEditTownComponent),

    data: { pageTitle: 'تعديل مدينة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/town/town.component').then(c => c.TownComponent),

    data: { pageTitle: 'عرض مدينة', pageType: 'view' }
  }
];
