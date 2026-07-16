import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { MediaInitiativesService } from '../../../../../shared/services/media-initiatives/media-initiatives.service';
import { AddEditMediaInitiativeComponent } from '../add-edit-mediai-nitiative/add-edit-media-initiative.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-mediainitiatives',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './mediainitiatives.component.html',
    styleUrl: './mediainitiatives.component.scss'
})
export class MediaInitiativesComponent extends BaseListComponent implements OnInit {
    @Input() initiativeId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();
    authHelper = inject(AuthHelper);
     get rolesEnum() {
                return RoleCodes;
            }
    tableOptions!: TableOptions;
    service = inject(MediaInitiativesService);

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/MediaInitiatives/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/MediaInitiatives/delete'
            },
            inputCols: [
                 { field: 'mediaTitle', header: 'عنوان الميديا', filter: true, filterMode: 'text' },
                { field: 'mediaUrl', header: 'الرابط', filter: true, filterMode: 'text' },               
               
                
            ],
            inputActions: [
                {
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row) => this.openAddEditDialog(row),
                    allowAll: true
                },
                this.authHelper.isAdmin ?
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }: {}
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId(),initiativeId: this.initiativeId  }
                    : {initiativeId: this.initiativeId }  
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditMediaInitiativeComponent,
            row ? 'تعديل متابعة ميديا' : 'اضافة متابعة ميديا',
            { id: row?.id ?? null, initiativeId: this.initiativeId }
        );
    }

    override loadDataFromServer(): void {
        this.dataTableService.loadData(this.tableOptions.inputUrl.getAll).subscribe({
            next: (res) => {
                this.data = res.data;
                this.totalCount = res.totalCount;
                this.totalCountChange.emit(this.totalCount);
            }
        });
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
