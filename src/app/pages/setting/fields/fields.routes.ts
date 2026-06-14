import { Routes } from '@angular/router';

export const fieldsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/fields/fields.component').then((c) => c.FieldsComponent),
        data: { pageTitle: 'المجالات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-field/add-edit-field.component').then((c) => c.AddEditFieldComponent),

        data: { pageTitle: 'اضافة مجال', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-field/add-edit-field.component').then((c) => c.AddEditFieldComponent),

        data: { pageTitle: 'تعديل مجال', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/field/field.component').then((c) => c.FieldComponent),

        data: { pageTitle: 'عرض مجال', pageType: 'view' }
    }
];
