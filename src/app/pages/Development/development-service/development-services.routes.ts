import { Routes } from '@angular/router';

export const developmentServicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/development-services/development-services.component').then((c) => c.DevelopmentServicesComponent),
        data: { pageTitle: 'الخدمات التنموية', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/development-service-tabs/development-service-tabs.component').then((c) => c.DevelopmentServiceTabsComponent),
        data: { pageTitle: 'اضافة خدمة تنموية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/development-service-tabs/development-service-tabs.component').then((c) => c.DevelopmentServiceTabsComponent),
        data: { pageTitle: 'تعديل خدمة تنموية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/development-service/development-service.component').then((c) => c.DevelopmentServiceComponent),
        data: { pageTitle: 'عرض خدمة تنموية', pageType: 'view' }
    },

];
