import { Routes } from '@angular/router';

export const citiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/cities/cities.component').then((c) => c.CitiesComponent),
        data: { pageTitle: 'المراكز', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-city/add-edit-city.component').then((c) => c.AddEditCityComponent),

        data: { pageTitle: 'اضافة مركز', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-city/add-edit-city.component').then((c) => c.AddEditCityComponent),

        data: { pageTitle: 'تعديل مركز', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/city/city.component').then((c) => c.CityComponent),

        data: { pageTitle: 'عرض مركز', pageType: 'view' }
    }
];
