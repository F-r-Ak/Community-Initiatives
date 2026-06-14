import { Routes } from '@angular/router';

export const vwOrganizationsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/vw-organizations/vw-organizations.component').then((c) => c.VwOrganizationsComponent),
        data: { pageTitle: 'الجمعيات', pageType: 'list' }
    }
];
