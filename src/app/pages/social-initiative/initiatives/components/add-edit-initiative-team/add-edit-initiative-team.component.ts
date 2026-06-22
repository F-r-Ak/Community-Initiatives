import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent } from '../../../../../shared/components/primeng/p-autocomplete/p-autocomplete.component';
import { SubmitButtonsComponent } from '../../../../../shared/components/submit-buttons/submit-buttons.component';
import { InitiativeTeamsService } from '../../../../../shared/services/initiative-teams/initiative-teams.service';
import { TeamMembersService } from '../../../../../shared/services/settings/team-members/team-members.service';

@Component({
    selector: 'app-add-edit-initiative-team',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-initiative-team.component.html',
    styleUrl: './add-edit-initiative-team.component.scss'
})
export class AddEditInitiativeTeamComponent extends BaseEditComponent implements OnInit {
    initiativeTeamsService = inject(InitiativeTeamsService);
    teamMembersService = inject(TeamMembersService);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    selectedMembers: any[] = [];
    initiativeId: string = '';

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.initiativeId = data?.initiativeId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        if (this.pageType === 'edit' && this.id) {
            this.getEditRecord();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [null],
            initiativeId: [this.initiativeId, Validators.required],
            teamMemberId: [[null], Validators.required]
        });
    }

    getTeamMembers(body: any) {
        return this.teamMembersService.getPaged(body);
    }

    getEditRecord() {
        this.initiativeTeamsService.getEditInitiativeTeam(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue({ ...data, teamMemberId: data.teamMemberId ?? [] });

            if (data.teamMemberId?.length) {
                // Fetch the full member objects so the autocomplete chips display nameAr correctly
                const body = {
                    pageNumber: 1,
                    pageSize: data.teamMemberId.length,
                    filter: { ids: data.teamMemberId },
                    orderByValue: [{ col: 'id', sort: 'asc' }]
                };
                this.teamMembersService.getDropDown(body).subscribe((res: any) => {
                    this.selectedMembers = res.data ?? [];
                    this.form.get('teamMemberId')?.setValue(this.selectedMembers.map((m: any) => m.id));
                });
            }
        });
    }

    onMembersSelect(selected: any[]) {
        this.selectedMembers = selected ?? [];
        this.form.get('teamMemberId')?.setValue(this.selectedMembers.map((m: any) => m.id));
    }

    submit() {
        if (this.form.invalid) return;
        const payload = this.form.value;

        if (this.pageType === 'add') {
            this.initiativeTeamsService.add(payload).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.initiativeTeamsService.update({ id: this.id, ...payload }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
