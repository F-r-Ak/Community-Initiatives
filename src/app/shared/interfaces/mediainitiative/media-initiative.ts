import { EnumDto } from '../..';
import { Lookup, SharedProperties } from '../shared/shared';

export interface MediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
    numberOfLikes: number;
    numberOfShares: number;
    numberOfComments: number;
    numberOfViews: number;
}

export interface AddMediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
    numberOfLikes: number;
    numberOfShares: number;
    numberOfComments: number;
    numberOfViews: number;
}

export interface UpdateMediaInitiativeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    initiativeId: string;
    mediaTitle: string;
    mediaUrl: string;
    mediaDescription: string;
    numberOfLikes: number;
    numberOfShares: number;
    numberOfComments: number;
    numberOfViews: number;
}
