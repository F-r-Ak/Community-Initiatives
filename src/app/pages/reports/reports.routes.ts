import { Routes } from '@angular/router';

export const ReportsRoutes: Routes = [
    {
        path: 'initiatives-report',
        loadComponent: () => import('./pages/initiatives-report/initiatives-report.component').then((c) => c.InitiativesReportComponent),
        data: { pageTitle: 'تقرير المبادرات', pageType: 'report' }
    },
    {
        path: 'activities-report',
        loadComponent: () => import('./pages/activities-report/activities-report.component').then((c) => c.ActivitiesReportComponent),
        data: { pageTitle: 'تقرير الأنشطة', pageType: 'report' }
    }
];
