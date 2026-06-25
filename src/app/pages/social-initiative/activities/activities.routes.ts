import { Routes } from '@angular/router';

export const activitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/activities/activities.component').then((c) => c.ActivitiesComponent),
        data: { pageTitle: 'الأنشطة', pageType: 'list' }
    }
];
