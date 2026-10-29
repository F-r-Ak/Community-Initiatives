import { Lookup, SharedProperties } from '../shared/shared';

export interface CentralBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    cityId: string;
    cityName: string;
    townId: string;
    townName: string;
    nationalInitiativeDetailId: string;
    nationalInitiativeName: string;
    beneficiaryMaleNumber: number;
    beneficiaryFemaleNumber: number;
    totalBeneficiaryNumber: number;
}

export interface AddCentralBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    cityId: string;
    townId: string;
    nationalInitiativeDetailId: string;
    beneficiaryMaleNumber: number;
    beneficiaryFemaleNumber: number;
    totalBeneficiaryNumber: number;
}

export interface UpdateCentralBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    cityId: string;
    townId: string;
    nationalInitiativeDetailId: string;
    beneficiaryMaleNumber: number;
    beneficiaryFemaleNumber: number;
    totalBeneficiaryNumber: number;
}
