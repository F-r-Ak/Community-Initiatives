import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface ServiceDetailDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    serviceTypeDetailId: string;
    serviceTypeDetailName:  string;
    value : string;
    notes : string;
    benefitPeriod : string ;
    benefitPeriodName : string ;
    benefitTypeId : string ;
    benefitTypeName : string ;


}
  

export interface AddServiceDetailDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    serviceTypeDetailId: string;
    serviceTypeDetailName:  string;
    value : string;
    notes : string;
    benefitPeriod : string ;
    benefitPeriodName : string ;
    benefitTypeId : string ;
    benefitTypeName : string ;
  
}

export interface UpdateServiceDetailDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    serviceTypeDetailId: string;
    serviceTypeDetailName:  string;
    value : string;
    notes : string;
    benefitPeriod : string ;
    benefitPeriodName : string ;
    benefitTypeId : string ;
    benefitTypeName : string ;
}
