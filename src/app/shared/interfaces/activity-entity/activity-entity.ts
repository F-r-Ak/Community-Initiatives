import { EnumDto } from '..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface ActivityEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    initiativeName: string;
    activityId: string;
    activityName: string;
    entityType: string;
    entityTypeName: EnumDto;
    entityTypeNameAr: string;
    entityId: string;
    entityName: string;
    organizationId: number | null;
    organizationName: string | null;
    otherEntityName: string | null;
    name: string | null;
}

export interface AddActivityEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    entities: [
        {
            entityId: string;
            entityType: EnumDto;
        }
    ];
    organizations: [
        {
            organizationId: number;
            organizationName: string;
            entityType: EnumDto;
            otherEntityName: string;
        }
    ];
}

export interface UpdateActivityEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    entities: [
        {
            entityId: string;
            entityType: EnumDto;
        }
    ];
    organizations: [
        {
            organizationId: number;
            organizationName: string;
            entityType: EnumDto;
            otherEntityName: string;
        }
    ];
}
