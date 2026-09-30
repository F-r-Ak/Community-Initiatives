import { Routes } from '@angular/router';

export const serviceTypeDetailsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/service-type-details/service-type-details.component').then((c) => c.ServiceTypeDetailsComponent),
        data: { pageTitle: 'تفاصيل الخدمة', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-service-type-detail/add-edit-service-type-detail.component').then((c) => c.AddEditServiceTypeDetailComponent),

        data: { pageTitle: 'اضافة تفاصيل الخدمة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-service-type-detail/add-edit-service-type-detail.component').then((c) => c.AddEditServiceTypeDetailComponent),

        data: { pageTitle: 'تعديل تفاصيل الخدمة', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/service-type-detail/service-type-detail.component').then((c) => c.ServiceTypeDetailComponent),

        data: { pageTitle: 'عرض تفاصيل الخدمة', pageType: 'view' }
    }
];
