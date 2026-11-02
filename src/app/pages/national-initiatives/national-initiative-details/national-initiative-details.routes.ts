import { Routes } from '@angular/router';

export const nationalInitiativeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/national-initiative-details/national-initiative-details.component').then((c) => c.NationalInitiativeDetailsComponent),
        data: { pageTitle: 'المبادرات الرئاسية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/national-initiative-tabs/national-initiative-tabs.component').then((c) => c.NationalInitiativeTabsComponent),
        data: { pageTitle: 'اضافة مبادرة رئاسية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/national-initiative-tabs/national-initiative-tabs.component').then((c) => c.NationalInitiativeTabsComponent),
        data: { pageTitle: 'تعديل مبادرة رئاسية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/national-initiative/national-initiative.component').then((c) => c.NationalInitiativeComponent),
        data: { pageTitle: 'عرض مبادرة رئاسية', pageType: 'view' }
    },
    {
        path: 'view-beneficiary/:id',
        loadComponent: () => import('./components/national-beneficiary/national-beneficiary.component').then((c) => c.NationalBeneficiaryComponent),
        data: { pageTitle: 'عرض مستفيد رئاسي', pageType: 'view' }
    },
    {
        path: 'view-support/:id',
        loadComponent: () => import('./components/national-support/national-support.component').then((c) => c.NationalSupportComponent),
        data: { pageTitle: 'عرض دعم رئاسي', pageType: 'view' }
    },

];
