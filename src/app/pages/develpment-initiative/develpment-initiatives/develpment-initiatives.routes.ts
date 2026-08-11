import { Routes } from '@angular/router';

export const DevelpmentInitiativesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/develpment-initiatives/develpment-initiatives.component').then((c) => c.DevelpmentInitiativesComponent),
        data: { pageTitle: 'المبادرات التنموية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-develpment-initiative/add-edit-develpment-initiative.component').then((c) => c.AddEditDevelpmentInitiativeComponent),

        data: { pageTitle: 'اضافة مبادرة تنموية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-develpment-initiative/add-edit-develpment-initiative.component').then((c) => c.AddEditDevelpmentInitiativeComponent),

        data: { pageTitle: 'تعديل مبادرة تنموية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/develpment-initiative/develpment-initiative.component').then((c) => c.DevelpmentInitiativeComponent),

        data: { pageTitle: 'عرض مبادرة تنموية', pageType: 'view' }
    }
];
