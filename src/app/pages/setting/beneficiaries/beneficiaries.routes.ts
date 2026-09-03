import { Routes } from '@angular/router';

export const beneficiariesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/beneficiaries/beneficiaries.component').then((c) => c.BeneficiariesComponent),
        data: { pageTitle: 'المستفيدين', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-beneficiary/add-edit-beneficiary.component').then((c) => c.AddEditBeneficiaryComponent),

        data: { pageTitle: 'اضافة مستفيد', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-beneficiary/add-edit-beneficiary.component').then((c) => c.AddEditBeneficiaryComponent),

        data: { pageTitle: 'تعديل مستفيد', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/beneficiary/beneficiary.component').then((c) => c.BeneficiaryComponent),

        data: { pageTitle: 'عرض مستفيد', pageType: 'view' }
    }
];
