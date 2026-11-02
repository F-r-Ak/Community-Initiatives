import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface NationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    entityType: number;
    entityTypeName: EnumDto;
    entityTypeNameAr: string;
    entityId: string;
    entityName: string;
    vw_OrganizationId: number;
    vw_OrganizationName: string;
    description: string;
}

export interface AddNationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    entityType: number;
    entities: [
        {
            entityId: string;
        }
    ];
    organizations: [
        {
            organizationId: number;
            organizationName: string;
            otherEntityName: string;
        }
    ];
    description: string;
}

export interface UpdateNationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    entityType: number;
    entities: [
        {
            entityId: string;
        }
    ];
    organizations: [
        {
            organizationId: number;
            organizationName: string;
            otherEntityName: string;
        }
    ];
    description: string;
}
