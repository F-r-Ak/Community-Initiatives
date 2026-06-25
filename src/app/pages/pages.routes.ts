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
                path: 'team-members',
                loadChildren: () => import('./setting/team-members/team-members.routes').then((m) => m.teamMembersRoutes)
            },
            {
                path: 'cities',
                loadChildren: () => import('./setting/cities/cities.routes').then((m) => m.citiesRoutes)
            },
            {
                path: 'towns',
                loadChildren: () => import('./setting/towns/towns.routes').then((m) => m.townsRoutes)
            }
        ]
    },
    {
        path: 'social-initiatives',
        children: [
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
