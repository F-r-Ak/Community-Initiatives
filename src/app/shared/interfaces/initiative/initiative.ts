import { Lookup, SharedProperties } from '../shared/shared';

export interface InitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    description: string;
    suggestedSolution: string;
    beneficiaryGroup: string;
    problemDescription: string;
    expectedImpact: string;
    stepsExecution: string;
    fieldId: string;
    cityId: string;
    initiativeMangerId: string;
}

export interface AddInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    description: string;
    suggestedSolution: string;
    beneficiaryGroup: string;
    problemDescription: string;
    expectedImpact: string;
    stepsExecution: string;
    fieldId: string;
    cityId: string;
    initiativeMangerId: string;
}

export interface UpdateInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    description: string;
    suggestedSolution: string;
    beneficiaryGroup: string;
    problemDescription: string;
    expectedImpact: string;
    stepsExecution: string;
    fieldId: string;
    cityId: string;
    initiativeMangerId: string;
}
