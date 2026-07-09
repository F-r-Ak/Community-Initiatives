import { Routes } from '@angular/router';

export const initiativesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/initiatives/initiatives.component').then((c) => c.InitiativesComponent),
        data: { pageTitle: 'المبادرات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/initiative-tabs/initiative-tabs.component').then((c) => c.InitiativeTabsComponent),
        data: { pageTitle: 'اضافة مبادرة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/initiative-tabs/initiative-tabs.component').then((c) => c.InitiativeTabsComponent),
        data: { pageTitle: 'تعديل مبادرة', pageType: 'edit' }
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/initiatives-dashboard/initiatives-dashboard.component').then((c) => c.InitiativesDashboardComponent),
        data: { pageTitle: 'الإحصائيات', pageType: 'dashboard' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/initiative/initiative.component').then((c) => c.InitiativeComponent),
        data: { pageTitle: 'عرض المبادرة', pageType: 'view' }
    }
];
