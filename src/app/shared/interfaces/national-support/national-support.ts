import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface NationalSupportDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nationalInitiativeDetailId: string;
    nationalInitiativeName: string;
    support: number;
    supportName: EnumDto;
    supportNameAr: string;
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
