import { EnumDto } from '../enum/enum';
import { Lookup, SharedProperties } from '../shared/shared';

export interface TeamMemberDto extends Lookup, Partial<SharedProperties> {
    gender: EnumDto;
    address: string;
    mobile: string;
    email: string;
    nationalID: string;
    birthDate: string;
    specailization: string;
    jobStatus: EnumDto;
    teamCategory: EnumDto;
    id: string;
    nameAr: string;
}

export interface AddTeamMemberDto extends Lookup, Partial<SharedProperties> {
    gender: EnumDto;
    address: string;
    mobile: string;
    email: string;
    nationalID: string;
    birthDate: string;
    specailization: string;
    jobStatus: EnumDto;
    teamCategory: EnumDto;
    id: string;
    nameAr: string;
}

export interface UpdateTeamMemberDto extends Lookup, Partial<SharedProperties> {
    gender: EnumDto;
    address: string;
    mobile: string;
    email: string;
    nationalID: string;
    birthDate: string;
    specailization: string;
    jobStatus: EnumDto;
    teamCategory: EnumDto;
    id: string;
    nameAr: string;
}
