import { Lookup, SharedProperties } from '../shared/shared';

export interface NationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    nationalInitiativeDetailName: string;
    entityId: string;
    entityName: string;
    description: string;
}

export interface AddNationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    entityId: string;
    entityName: string;
    description: string;
}

export interface UpdateNationalEntityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    entityId: string;
    entityName: string;
    description: string;
}
