import { Lookup, SharedProperties } from '../shared/shared';
import { Attachment } from '../attachment/attachment';
import { EnumDto } from '../..';

export interface NationalInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentInitiativeId: string;
    developmentInitiativeName: string;
    beneficiaryGroupId: string;
    beneficiaryGroupName: string;
    entityId: string;
    entityName: string;
    executeTypeId: string;
    executeTypeName: string;
    executionStatus: number;
    executionStatusName: EnumDto;
    executionStatusNameAr: string;
    problemDescription: string;
    workPlan: string;
    stepsExecution: string;
    results: string;
    attachs: Attachment[];
}

export interface AddNationalInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentInitiativeId: string;
    beneficiaryGroupId: string;
    entityId: string;
    executeTypeId: string;
    executionStatus: number;
    problemDescription: string;
    workPlan: string;
    stepsExecution: string;
    results: string;
    attachs: Attachment[];
}

export interface UpdateNationalInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentInitiativeId: string;
    beneficiaryGroupId: string;
    entityId: string;
    executeTypeId: string;
    executionStatus: number;
    problemDescription: string;
    workPlan: string;
    stepsExecution: string;
    results: string;
    attachs: Attachment[];
}
