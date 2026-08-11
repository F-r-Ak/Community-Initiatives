import { EnumDto } from '..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface DevelpmentInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    fieldId: string;
    initiativeStartDate: string;
    initiativeEndDate: string;
    initiativeCategory: string;
}

export interface AddDevelpmentInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    fieldId: string;
    initiativeStartDate: string;
    initiativeEndDate: string;
    initiativeCategory: string;
}


export interface UpdateDevelpmentInitiativeDto extends Lookup, Partial<SharedProperties> {

    id: string;
    name: string;
    fieldId: string;
    initiativeStartDate: string;
    initiativeEndDate: string;
    initiativeCategory: string;
}
