import { Routes } from '@angular/router';

export const InitiativesDefinitionsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/initiatives-definitions/initiatives-definitions.component').then((c) => c.InitiativesDefinitionsComponent),
        data: { pageTitle: 'تعريف المبادرات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-initiative/add-edit-initiative.component').then((c) => c.AddEditInitiativeComponent),

        data: { pageTitle: 'اضافة مبادرة', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-initiative/add-edit-initiative.component').then((c) => c.AddEditInitiativeComponent),

        data: { pageTitle: 'تعديل مبادرة', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/initiative-definition/initiative-definition.component').then((c) => c.InitiativeDefinitionComponent),

        data: { pageTitle: 'عرض مبادرة', pageType: 'view' }
    }
];
