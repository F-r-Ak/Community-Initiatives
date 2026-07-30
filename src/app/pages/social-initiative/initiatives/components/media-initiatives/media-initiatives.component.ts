import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { MediaInitiativesService } from '../../../../../shared/services/media-initiatives/media-initiatives.service';
import { AddEditMediaInitiativeComponent } from '../add-edit-mediai-nitiative/add-edit-media-initiative.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-media-initiatives',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './media-initiatives.component.html',
    styleUrl: './media-initiatives.component.scss'
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
                 { field: 'mediaUrl', header: 'الرابط', filter: true, filterMode: 'attachments' },


            ],
            inputActions: [

               {
        name: 'viewMedia',
        icon: 'pi pi-eye',
        color: 'text-info',
        isCallBack: true,
        call: (row) => this.openViewDialog(row), // استدعاء دالة فتح العرض
        allowAll: true
    },
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
openViewDialog(row: any) {
    this.openDialog(
        AddEditMediaInitiativeComponent,
        'تفاصيل متابعة الميديا',
        { id: row.id, initiativeId: this.initiativeId, isViewMode: true }
    );
}
    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditMediaInitiativeComponent,
            row ? 'تعديل متابعة ميديا' : 'اضافة متابعة ميديا',
            { id: row?.id ?? null, initiativeId: this.initiativeId, isViewMode: true, rowData: row }
        );
    }

override loadDataFromServer(): void {
    this.dataTableService.loadData(this.tableOptions.inputUrl.getAll).subscribe({
        next: (res) => {
            this.data = res.data.map((item: any) => ({
                ...item,
                mediaUrl: item.mediaUrl ? { 
                    name: '🔗 فتح الرابط',   // خيار 1: أيقونة رابط مع كلمة
                    // name: '⬇️ تحميل',      // خيار 2: أيقونة تنزيل
                    // name: '🌐 الذهاب للموقع', // خيار 3: أيقونة كورية
                    url: item.mediaUrl 
                } : null
            }));

            this.totalCount = res.totalCount;
            this.totalCountChange.emit(this.totalCount);
        }
    });
}

onDownloadAttachment(attachment: any) {
    const url = typeof attachment === 'string' ? attachment : (attachment?.url || attachment?.name);

    if (url) {
        const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(validUrl, '_blank');
    }
}

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
