import { Lookup, SharedProperties } from '../shared/shared';

export interface TownDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    cityId: string;
    cityName: string;
}
export interface AddTownDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    cityId: string;
}
export interface UpdateTownDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    cityId: string;
}
