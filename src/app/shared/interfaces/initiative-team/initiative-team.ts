import { Lookup, SharedProperties } from '../shared/shared';

export interface InitiativeTeamDto extends Lookup, Partial<SharedProperties> {
  id: string;
  initiativeId: string;
  teamMemberId: string[]
}

export interface AddInitiativeTeamDto extends Lookup, Partial<SharedProperties> {
    id: string;
  initiativeId: string;
  teamMemberId: string[]
}

export interface UpdateInitiativeTeamDto extends Lookup, Partial<SharedProperties> {
    id: string;
  initiativeId: string;
  teamMemberId: string[]
}
