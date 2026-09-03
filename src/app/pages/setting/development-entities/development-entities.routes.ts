import { Routes } from '@angular/router';

export const developmentEntitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/development-entities/development-entities.component').then((c) => c.DevelopmentEntitiesComponent),
        data: { pageTitle: 'الجهات التنموية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-development-entity/add-edit-development-entity.component').then((c) => c.AddEditDevelopmentEntityComponent),

        data: { pageTitle: 'اضافة الجهات التنموية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-development-entity/add-edit-development-entity.component').then((c) => c.AddEditDevelopmentEntityComponent),

        data: { pageTitle: 'تعديل الجهات التنموية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/development-entity/development-entity.component').then((c) => c.DevelopmentEntityComponent),

        data: { pageTitle: 'عرض الجهات التنموية', pageType: 'view' }
    }
];
