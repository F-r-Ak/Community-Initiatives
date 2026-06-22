import { Lookup, SharedProperties } from '../shared/shared';
import { Attachment } from '../attachment/attachment';

export interface ActivityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    name: string;
    cityId: string;
    townId: string;
    address: string;
    activityTypeId: string;
    executeTypeId: string;
    startDate: string;
    endDate: string;
    activityTime: string;
    activityManager: string;
    entityType: string;
    entityId: string;
    vw_OrganizationId: number;
    organizationName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfActivity: number;
    notes: string;
    executionStatus: string;
    attachs: Attachment[];
}

export interface AddActivityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    name: string;
    cityId: string;
    townId: string;
    address: string;
    activityTypeId: string;
    executeTypeId: string;
    startDate: string;
    endDate: string;
    activityTime: string;
    activityManager: string;
    entityType: string;
    entityId: string;
    vw_OrganizationId: number;
    organizationName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfActivity: number;
    notes: string;
    executionStatus: string;
    attachs: Attachment[];
}

export interface UpdateActivityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    name: string;
    cityId: string;
    townId: string;
    address: string;
    activityTypeId: string;
    executeTypeId: string;
    startDate: string;
    endDate: string;
    activityTime: string;
    activityManager: string;
    entityType: string;
    entityId: string;
    vw_OrganizationId: number;
    organizationName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfActivity: number;
    notes: string;
    executionStatus: string;
    attachs: Attachment[];
}
