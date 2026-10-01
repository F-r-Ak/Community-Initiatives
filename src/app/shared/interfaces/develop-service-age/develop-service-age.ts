import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface DevelopServiceAgeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    developmentServiceId: string;
    ageGroupId: string;
    ageGroupName: string;
    ageGroupNameAr: string;
    note: string | null;
   
}
  

export interface AddDevelopServiceAgeDto extends Lookup, Partial<SharedProperties> {
     id: string;
    developmentServiceId: string;
    ageGroupId: string;
    ageGroupName: string;
    ageGroupNameAr: string;
    note: string | null;
}
  


export interface UpdateDevelopServiceAgeDto extends Lookup, Partial<SharedProperties> {
     id: string;
    developmentServiceId: string;
    ageGroupId: string;
    ageGroupName: string;
    ageGroupNameAr: string;
    note: string | null;
}
