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

];
