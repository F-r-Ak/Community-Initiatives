import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface MediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
}

export interface AddMediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
   
}

export interface UpdateMediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
}
