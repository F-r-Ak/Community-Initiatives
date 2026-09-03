import { Routes } from '@angular/router';

export const executeTypesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/execute-types/execute-types.component').then((c) => c.ExecuteTypesComponent),
        data: { pageTitle: 'موقع التنفيذ', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-execute-type/add-edit-execute-type.component').then((c) => c.AddEditExecuteTypeComponent),

        data: { pageTitle: 'اضافة موقع التنفيذ', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-execute-type/add-edit-execute-type.component').then((c) => c.AddEditExecuteTypeComponent),

        data: { pageTitle: 'تعديل موقع التنفيذ', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/execute-type/execute-type.component').then((c) => c.ExecuteTypeComponent),

        data: { pageTitle: 'عرض موقع التنفيذ', pageType: 'view' }
    }
];
