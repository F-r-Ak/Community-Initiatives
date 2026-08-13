import { Routes } from '@angular/router';

export const serviceNamesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/service-names/service-names.component').then((c) => c.ServiceNamesComponent),
        data: { pageTitle: 'أسماء الخدمات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-service-name/add-edit-service-name.component').then((c) => c.AddEditServiceNameComponent),

        data: { pageTitle: 'اضافة اسم خدمة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-service-name/add-edit-service-name.component').then((c) => c.AddEditServiceNameComponent),

        data: { pageTitle: 'تعديل اسم الخدمة', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/service-name/service-name.component').then((c) => c.ServiceNameComponent),

        data: { pageTitle: 'عرض اسم الخدمة', pageType: 'view' }
    }
];
