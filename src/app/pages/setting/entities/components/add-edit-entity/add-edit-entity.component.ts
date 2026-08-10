import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, EntitiesService, PrimeAutoCompleteComponent, EntityTypesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { EnumDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-add-edit-entity',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent],
  templateUrl: './add-edit-entity.component.html',
  styleUrl: './add-edit-entity.component.scss'
})
export class AddEditEntityComponent extends BaseEditComponent implements OnInit {
    entitiesService: EntitiesService = inject(EntitiesService);
    entityTypesService: EntityTypesService = inject(EntityTypesService);
    dialogService: DialogService = inject(DialogService);

    entityTypesList: EnumDto[] = [];
    filteredEntityTypes: EnumDto[] = [];
    selectedEntityType: EnumDto | null = null;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        this.loadEntityTypes();
        if (this.pageType === 'edit') {
            this.getEditEntity();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            nameAr: ['', Validators.required],
            entityType: ['', Validators.required]
        });
    }

    loadEntityTypes() {
        this.entityTypesService.entityTypes.subscribe((types) => {
            this.entityTypesList = types ?? [];
            this.filteredEntityTypes = [...this.entityTypesList];
            // Re-resolve selectedEntityType once the list is loaded (handles race condition on edit)
            if (this.pageType === 'edit' && this.form && !this.selectedEntityType) {
                const entityTypeValue = this.form.get('entityType')?.value;
                if (entityTypeValue) {
                    const match = this.entityTypesList.find(
                        (t) => t.nameEn === entityTypeValue || t.nameAr === entityTypeValue
                    );
                    if (match) {
                        this.selectedEntityType = match;
                    }
                }
            }
        });
    }

    getEntityTypes(event: any) {
        const query = (event.query ?? '').toLowerCase();
        this.filteredEntityTypes = this.entityTypesList.filter((t) =>
            t.nameAr.toLowerCase().includes(query)
        );
    }

    onEntityTypeSelect(selected: any) {
        this.selectedEntityType = selected?.value ?? null;
        if (this.selectedEntityType) {
            this.form.get('entityType')?.setValue(this.selectedEntityType.nameEn);
        }
    }

    getEditEntity = () => {
        this.entitiesService.getEditEntity(this.id).subscribe((entity: any) => {
            this.initFormGroup();
            this.form.patchValue(entity);
            if (entity.entityType) {
                // Try to find the matching type from the loaded list (prefer list match for full object)
                const matchingType = this.entityTypesList.find(
                    (t) => t.nameEn === entity.entityType || t.nameAr === entity.entityType || t.id === entity.entityType?.id
                );
                this.selectedEntityType = matchingType ?? (typeof entity.entityType === 'object' ? entity.entityType : null);
                this.form.get('entityType')?.setValue(entity.entityType?.nameEn ?? entity.entityType);
            }
        });
    };

    submit() {
        if (this.pageType === 'add')
            this.entitiesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.entitiesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
            const index = currentRoute.lastIndexOf('/');
            const str = currentRoute.substring(0, index);
            this.route.navigate([str]);
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
