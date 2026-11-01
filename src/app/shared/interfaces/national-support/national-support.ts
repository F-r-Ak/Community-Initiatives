import { Lookup, SharedProperties } from '../shared/shared';

export interface NationalSupportDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    nationalInitiativeDetailName: string;
    support: number;
    supportDetailId: string;
    supportDetailName: string;
    value: string;
}

export interface AddNationalSupportDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    support: number;
    supportDetailId: string;
    value: string;
}

export interface UpdateNationalSupportDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    support: number;
    supportDetailId: string;
    value: string;
}
