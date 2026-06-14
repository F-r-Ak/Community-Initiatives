import { Routes } from '@angular/router';

export const activityTypesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/activity-types/activity-types.component').then((c) => c.ActivityTypesComponent),
        data: { pageTitle: 'أنواع الأنشطة', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-activity-type/add-edit-activity-type.component').then((c) => c.AddEditActivityTypeComponent),

        data: { pageTitle: 'اضافة نوع نشاط', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-activity-type/add-edit-activity-type.component').then((c) => c.AddEditActivityTypeComponent),

        data: { pageTitle: 'تعديل نوع نشاط', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/activity-type/activity-type.component').then((c) => c.ActivityTypeComponent),

        data: { pageTitle: 'عرض نوع النشاط', pageType: 'view' }
    }
];
