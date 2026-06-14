import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-initiative-teams',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './initiative-teams.component.html',
    styleUrl: './initiative-teams.component.scss'
})
export class InitiativeTeamsComponent {
    @Input() initiativeId: string = '';
}
