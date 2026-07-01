import { Lookup, SharedProperties } from '../shared/shared';

export interface ActivityBeneficiaryGroupDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    activityName: string;
    initiativeId: string;
    initiativeName: string;
    beneficiaryGroupId: string;
    beneficiaryGroupName: string;
    activityCityId: string;
    activityCityName: string;
    activityTownId: string;
    activityTownName: string;
    activityTypeId: string;
    activityTypeName: string;
    executeTypeId: string;
    executeTypeName: string;
    startDate: string;
    endDate: string;
}

export interface AddActivityBeneficiaryGroupDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    beneficiaryGroupId: string[];
}

export interface UpdateActivityBeneficiaryGroupDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    beneficiaryGroupId: string[];
}
