import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface InitiativeTeamDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    initiativeName: string;
    fieldId: string;
    fieldName: string;
    cityId: string;
    cityName: string;
    teamCategory: string;
    teamCategoryName: EnumDto;
    teamMemberId: string;
    teamMemberName: string;
    nationalID: string | null;
    teamCategoryNameAr: string;
    jobStatus: string;
    jobStatusName: EnumDto;
    jobStatusNameAr: string;
}

export interface AddInitiativeTeamDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    teamMemberId: string[];
}

export interface UpdateInitiativeTeamDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    teamMemberId: string[];
}
