import { Component, Input, OnInit, inject ,  OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions , PrimeTitleToolBarComponent} from '../../../../../shared';
import { ServiceDevelopmentEntitiesService } from '../../../../../shared/services/service-developmentEntity/service-developmentEntity.service';
import { AddEditServiceDevelopmentEntityComponent } from '../add-edit-service-developmentEntity/add-edit-service-developmentEntity.component';
import { ServiceDevelopmentEntityComponent } from '../service-developmentEntity/service-developmentEntity.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';
import { ServiceDevelopmentEntityDto } from '../../../../../shared/interfaces/service-developmentEntity/service-developmentEntity';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
    selector: 'app-service-developmentEntities',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './service-developmentEntities.component.html',
    styleUrl: './service-developmentEntities.component.scss'
})
export class ServiceDevelopmentEntitiesComponent extends BaseListComponent implements OnInit, OnChanges {

    
    tableOptions!: TableOptions;
      service = inject(ServiceDevelopmentEntitiesService);
      authHelper = inject(AuthHelper);
  
      get rolesEnum() {
          return RoleCodes;
      }
  
    @Input() developmentServiceId: string = '';
  
      constructor(activatedRoute: ActivatedRoute) {
          super(activatedRoute);
      }
  
      override ngOnInit(): void {
        this.developmentServiceId = this.developmentServiceId ?? this.activatedRoute.snapshot.params['developmentServiceId'] ?? '';
          super.ngOnInit();
          this.pageTitle = 'الجهات المنفذة';
          this.initializeTableOptions();
      }
  
      ngOnChanges(changes: SimpleChanges): void {
          if (changes['developmentServiceId'] && !changes['developmentServiceId'].firstChange) {
              this.developmentServiceId = this.developmentServiceId ?? '';
              this.initializeTableOptions();
          }
      }
  
      initializeTableOptions() {
          this.tableOptions = {
              inputUrl: {
                  getAll: 'v1/service_developmententity/getpaged',
                  getAllMethod: 'POST',
                  delete: 'v1/service_developmententity/delete'
              },
              inputCols: [
                  { field: 'developmentServiceName', header: 'الخدمة التنموية', filter: true, filterMode: 'text' },
                  { field: 'developmentEntityTypeName.nameAr', header: ' الجهة', filter: true, filterMode: 'text' },
                
              ],
              inputActions: [
                  {
                      name: 'VIEW',
                      icon: 'pi pi-eye',
                      color: 'text-info',
                      isCallBack: true,
                      call: (row: any) => this.openViewDialog(row),
                      allowAll: true
                  },
                  this.authHelper.isAdmin
                      ? { name: 'DELETE', icon: 'pi pi-trash', color: 'text-error', allowAll: true, isDelete: true }
                      : {}
              ],
              permissions: {
                  componentName: 'COMMUNITY-INITIATIVES-ACTIVITY-ENTITIES',
                  allowAll: true,
                  listOfPermissions: []
              },
              bodyOptions: {
                  filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                      ? { createdById: this.authHelper.getUserId(), developmentServiceId: this.developmentServiceId }
                      : { developmentServiceId: this.developmentServiceId }
              }
          };
      }
  
      openAddEditDialog(row?: any) {
          this.openDialog(
              AddEditServiceDevelopmentEntityComponent,
              row ? 'تعديل الجهات المنفذة' : 'اضافة الجهات المنفذة',
              { id: row?.id ?? null, developmentServiceId: this.developmentServiceId }
          );
      }
  
      openViewDialog(rowData: any) {
          this.openDialog(
              ServiceDevelopmentEntityComponent,
              'عرض الجهات المنفذة',
              { pageType: 'view', row: { rowData } },
              { closable: true }
          );
      }
  
      override ngOnDestroy() {
          this.destroy$.next(true);
          this.destroy$.unsubscribe();
      }
  }
  
  