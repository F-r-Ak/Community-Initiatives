import { Routes } from '@angular/router';

export const ageGroupsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/age-groups/age-groups.component').then((c) => c.AgeGroupsComponent),
        data: { pageTitle: 'مجموعات الأعمار', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-age-groups/add-edit-age-group.component').then((c) => c.AddEditAgeGroupComponent),

        data: { pageTitle: 'اضافة مجموعة أعمار', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-age-groups/add-edit-age-group.component').then((c) => c.AddEditAgeGroupComponent),

        data: { pageTitle: 'تعديل مجموعة أعمار', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/age-group/age-group.component').then((c) => c.AgeGroupComponent),

        data: { pageTitle: 'عرض مجموعة أعمار', pageType: 'view' }
    }
];
