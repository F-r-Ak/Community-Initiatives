import { Routes } from '@angular/router';

export const supportDetailsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/support-details/support-details.component').then((c) => c.SupportDetailsComponent),
        data: { pageTitle: 'تفاصيل الدعم', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-support-detail/add-edit-support-detail.component').then((c) => c.AddEditSupportDetailComponent),

        data: { pageTitle: 'اضافة تفاصيل الدعم', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-support-detail/add-edit-support-detail.component').then((c) => c.AddEditSupportDetailComponent),

        data: { pageTitle: 'تعديل تفاصيل الدعم', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/support-detail/support-detail.component').then((c) => c.SupportDetailComponent),

        data: { pageTitle: 'عرض تفاصيل الدعم', pageType: 'view' }
    }
];
