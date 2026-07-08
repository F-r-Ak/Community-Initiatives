import { Routes } from '@angular/router';

export const ReportRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/report/reports.component').then((c) => c.ReportsComponent),
        data: { pageTitle: 'تقرير ', pageType: 'report' }
    }
];
