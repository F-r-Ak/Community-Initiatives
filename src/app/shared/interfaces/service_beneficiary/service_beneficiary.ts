import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface ServiceBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    entityType: string;
    entityTypeName: EnumDto;
    entityTypeNameAr: string;
    entityId: string;
    entityName: string;
    organizationId: number | null;
    organizationName: string | null;
    otherEntityName: string | null;
    name: string | null;
    beneficiaryId: string[] | string | null;
    beneficiaryName: string | null;
}

export interface AddServiceBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string | null;
    developmentServiceId: string;
    beneficiaryId: string[] | null;
}

export interface UpdateServiceBeneficiaryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    beneficiaryId: string[] | null;
}
