import { Lookup, SharedProperties } from '../shared/shared';

export interface ActivityBeneficiaryGroupDto extends Lookup, Partial<SharedProperties> {
    id: string;
    activityId: string;
    beneficiaryGroupId: string[];
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
