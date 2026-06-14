import { Routes } from '@angular/router';

export const entitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/entities/entities.component').then((c) => c.EntitiesComponent),
        data: { pageTitle: 'المديريات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-entity/add-edit-entity.component').then((c) => c.AddEditEntityComponent),

        data: { pageTitle: 'اضافة مديرية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-entity/add-edit-entity.component').then((c) => c.AddEditEntityComponent),

        data: { pageTitle: 'تعديل مديرية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/entity/entity.component').then((c) => c.EntityComponent),

        data: { pageTitle: 'عرض مديرية', pageType: 'view' }
    }
];
