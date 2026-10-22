import { Routes } from '@angular/router';

export const nationalInitiativeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/national-initiative-details/national-initiative-details.component').then((c) => c.NationalInitiativeDetailsComponent),
        data: { pageTitle: 'خدمات التنموية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-national-initiative-detail/add-edit-national-initiative-detail.component').then((c) => c.AddEditNationalInitiativeDetailComponent),
        data: { pageTitle: 'اضافة مبادرة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-national-initiative-detail/add-edit-national-initiative-detail.component').then((c) => c.AddEditNationalInitiativeDetailComponent),
        data: { pageTitle: 'تعديل مبادرة', pageType: 'edit' }
    },
    {
        path: 'dashboard',
        loadComponent: () => import('../development-service-dashboard/development-service-dashboard.component').then((c) => c.DevelopmentServiceDashboardComponent),
        data: { pageTitle: 'الإحصائيات الخدمات التنموية', pageType: 'dashboard' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/add-edit-national-initiative-detail/add-edit-national-initiative-detail.component').then((c) => c.AddEditNationalInitiativeDetailComponent),
        data: { pageTitle: 'عرض المبادرة', pageType: 'view' }
    },
     
];
