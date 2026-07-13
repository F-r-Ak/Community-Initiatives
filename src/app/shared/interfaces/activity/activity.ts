import { Lookup, SharedProperties } from '../shared/shared';
import { Attachment } from '../attachment/attachment';
import { EnumDto } from '../..';

export interface ActivityDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    initiativeId: string;
    initiativeName: string;
    fieldId: string;
    fieldName: string;
    cityId: string;
    cityName: string;
    townId: string;
    townName: string;
    address: string;
    activityTypeId: string;
    executeTypeId: string;
    startDate: string;
    endDate: string;
    activityTime: string;
    activityManger: string;
    entityType: string;
    entityTypeName: EnumDto;
    entityTypeNameAr: string;
    entityId: string;
    organizationId: number;
    organizationName: string;
    otherEntityName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfFemaleBeneficiaries: number;
    numberOfMaleBeneficiaries: number;
    numberOfActivity: number;
    notes: string;
    executionStatus: string;
    executionStatusName: EnumDto;
    executionStatusNameAr: string;
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
    activityManger: string;
    entityType: string;
    entityId: string;
    organizationId: number;
    organizationName: string;
    otherEntityName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfFemaleBeneficiaries: number;
    numberOfMaleBeneficiaries: number;
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
    activityManger: string;
    entityType: string;
    entityId: string;
    organizationId: number;
    organizationName: string;
    otherEntityName: string;
    numberOfVolunteers: number;
    numberOfBeneficiaries: number;
    numberOfFemaleBeneficiaries: number;
    numberOfMaleBeneficiaries: number;
    numberOfActivity: number;
    notes: string;
    executionStatus: string;
    attachs: Attachment[];
}
