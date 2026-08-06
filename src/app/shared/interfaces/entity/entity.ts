import { EnumDto } from '..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface EntityDto extends Lookup, Partial<SharedProperties> {
    entityType: EnumDto;
    id: string;
    nameAr: string;
}

export interface AddEntityDto extends Lookup, Partial<SharedProperties> {
    entityType: string;
    id: string;
    nameAr: string;
}

export interface UpdateEntityDto extends Lookup, Partial<SharedProperties> {
    entityType: string;
    id: string;
    nameAr: string;
}
