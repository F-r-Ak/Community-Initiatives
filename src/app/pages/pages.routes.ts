import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    {
        path: 'settings',
        children: [
            {
                path: 'activity-types',
                loadChildren: () => import('./setting/activity-types/activity-types.routes').then((m) => m.activityTypesRoutes)
            },
            {
                path: 'execute-types',
                loadChildren: () => import('./setting/execute-types/execute-types.routes').then((m) => m.executeTypesRoutes)
            },
            {
                path: 'fields',
                loadChildren: () => import('./setting/fields/fields.routes').then((m) => m.fieldsRoutes)
            },
            {
                path: 'entities',
                loadChildren: () => import('./setting/entities/entities.routes').then((m) => m.entitiesRoutes)
            },
            {
                path: 'organizations',
                loadChildren: () => import('./setting/vw-organizations/vw-organizations.routes').then((m) => m.vwOrganizationsRoutes)
            },
            {
                path: 'beneficiary-groups',
                loadChildren: () => import('./setting/beneficiary-groups/beneficiary-groups.routes').then((m) => m.beneficiaryGroupsRoutes)
            },
            {
                path: 'cities',
                loadChildren: () => import('./setting/cities/cities.routes').then((m) => m.citiesRoutes)
            },
                {
                    path: 'towns',
                    loadChildren: () => import('./setting/towns/towns.routes').then((m) => m.townsRoutes)
            },
            {
                path: 'service-names',
                loadChildren: () => import('./setting/service-names/service-names.routes').then((m) => m.serviceNamesRoutes)
            },
               {
                path: 'beneficiaries',
                loadChildren: () => import('./setting/beneficiaries/beneficiaries.routes').then((m) => m.beneficiariesRoutes)
            },
            {
                path: 'development-entities',
                loadChildren: () => import('./setting/development-entities/development-entities.routes').then((m) => m.developmentEntitiesRoutes)
            }
        ]
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then((m) => m.ReportsRoutes)
    },

    {
        path: 'social-initiatives',
        children: [
            {
                path: 'team-members',
                loadChildren: () => import('./social-initiative/team-members/team-members.routes').then((m) => m.teamMembersRoutes)
            },
            {
                path: 'initiatives',
                loadChildren: () => import('./social-initiative/initiatives/initiatives.routes').then((m) => m.initiativesRoutes)
            },
            {
                path: 'activities',
                loadChildren: () => import('./social-initiative/activities/activities.routes').then((m) => m.activitiesRoutes)
            }
        ]
    },
      {
        path: 'develpment-initiatives',
        children: [
            {
                path: 'develpment-initiatives',
                loadChildren: () => import('./develpment-initiative/develpment-initiatives/develpment-initiatives.routes').then((m) => m.DevelpmentInitiativesRoutes)
            }
        ]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'users',
                loadChildren: () => import('./auth/users/users.routes').then((m) => m.UsersRoutes)
            },
            {
                path: 'roles',
                loadChildren: () => import('./auth/roles/roles.routes').then((m) => m.RolesRoutes)
            },
            {
                path: 'modules',
                loadChildren: () => import('./auth/modules/modules.routes').then((m) => m.ModulesRoutes)
            }
        ]
    },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
