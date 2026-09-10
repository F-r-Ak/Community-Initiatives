import { Routes } from '@angular/router';

export const developmentServicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/development-services/development-services.component').then((c) => c.DevelopmentServicesComponent),
        data: { pageTitle: 'خدمات التنموية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/development-service-tabs/development-service-tabs.component').then((c) => c.DevelopmentServiceTabsComponent),
        data: { pageTitle: 'اضافة مبادرة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/development-service-tabs/development-service-tabs.component').then((c) => c.DevelopmentServiceTabsComponent),
        data: { pageTitle: 'تعديل مبادرة', pageType: 'edit' }
    },
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./pages/development-services-dashboard/development-services-dashboard.component').then((c) => c.DevelopmentServicesDashboardComponent),
    //     data: { pageTitle: 'الإحصائيات', pageType: 'dashboard' }
    // },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/development-service/development-service.component').then((c) => c.DevelopmentServiceComponent),
        data: { pageTitle: 'عرض المبادرة', pageType: 'view' }
    },
     
];
