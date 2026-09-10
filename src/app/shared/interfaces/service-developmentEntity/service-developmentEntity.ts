import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface ServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    name: string;
    entities: [];
    organizations: [];
  
}

export interface AddServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    name: string;
    entities: [];
    organizations: [];
  
}

export interface UpdateServiceDevelopmentEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    name: string;
    entities: [];
    organizations: [];
 
}
