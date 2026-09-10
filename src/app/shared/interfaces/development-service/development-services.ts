import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface DevelopmentServiceDto extends Lookup, Partial<SharedProperties> {
     id: string;
    name: string;
    notes: string;
    value: string;
    beneficiaryNumber: string;
    townId: string;
    cityId: string;
    entityId: string;
    serviceNameId: string;
    entityType: string;
    initiativeCategory: string;
    developmentInitiativeId: string;
    serviceStartDate: string;
    serviceEndDate: string;
    cityName: string;
    townName: string;
    serviceName: string;
    entityName: string;
 
}

export interface AddDevelopmentServiceDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    notes: string;
    value: string;
    beneficiaryNumber: string;
    townId: string;
    cityId: string;
    entityId: string;
    serviceNameId: string;
    entityType: string;
    initiativeCategory: string;
    developmentInitiativeId: string;
    serviceStartDate: string;
    serviceEndDate: string;
  
}

export interface UpdateDevelopmentServiceDto extends Lookup, Partial<SharedProperties> {
    id: string;
    name: string;
    notes: string;
    value: string;
    beneficiaryNumber: string;
    townId: string;
    cityId: string;
    entityId: string;
    serviceNameId: string;
    entityType: string;
    initiativeCategory: string;
    developmentInitiativeId: string;
    serviceStartDate: string;
    serviceEndDate: string;
}
