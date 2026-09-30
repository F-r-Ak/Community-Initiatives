import { Routes } from '@angular/router';

export const benefitTypesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/benefit-types/benefit-types.component').then((c) => c.BenefitTypesComponent),
        data: { pageTitle: 'نوع الاستفادة', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-benefit-type/add-edit-benefit-type.component').then((c) => c.AddEditBenefitTypeComponent),

        data: { pageTitle: 'اضافة نوع الاستفادة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-benefit-type/add-edit-benefit-type.component').then((c) => c.AddEditBenefitTypeComponent),

        data: { pageTitle: 'تعديل نوع الاستفادة', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/benefit-type/benefit-type.component').then((c) => c.BenefitTypeComponent),

        data: { pageTitle: 'عرض نوع الاستفادة', pageType: 'view' }
    }
];
