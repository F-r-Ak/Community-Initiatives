import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface ServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
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
  

export interface AddServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
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
  


export interface UpdateServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
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
