import { Routes } from '@angular/router';

export const beneficiaryGroupsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/beneficiary-groups/beneficiary-groups.component').then((c) => c.BeneficiaryGroupsComponent),
        data: { pageTitle: 'فئة المستفيدين', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-beneficiary-group/add-edit-beneficiary-group.component').then((c) => c.AddEditBeneficiaryGroupComponent),

        data: { pageTitle: 'اضافة فئة مستفيدين', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-beneficiary-group/add-edit-beneficiary-group.component').then((c) => c.AddEditBeneficiaryGroupComponent),

        data: { pageTitle: 'تعديل فئة مستفيدين', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/beneficiary-group/beneficiary-group.component').then((c) => c.BeneficiaryGroupComponent),

        data: { pageTitle: 'عرض فئة مستفيدين', pageType: 'view' }
    }
];
