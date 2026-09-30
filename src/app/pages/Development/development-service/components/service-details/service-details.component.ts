import { Component, Input, OnInit, inject ,  OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions , PrimeTitleToolBarComponent} from '../../../../../shared';
import { ServiceDetailsService } from '../../../../../shared';
import { AddEditServiceDetailComponent } from '../add-edit-service-detail/add-edit-service-detail.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';
import { ServiceDevelopmentEntityDto } from '../../../../../shared/interfaces/service-developmentEntity/service-developmentEntity';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
    selector: 'app-service-details',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './service-details.component.html',
    styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent extends BaseListComponent implements OnInit, OnChanges {

    
    tableOptions!: TableOptions;
      service = inject(ServiceDetailsService);
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
          this.pageTitle = 'تفاصيل الخدمة';
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
                  getAll: 'service_details/getpaged',
                  getAllMethod: 'POST',
                  delete: 'service_details/delete'
              },
              inputCols: [
                  { field: 'serviceTypeDetailName', header: 'تفاصيل الخدمة', filter: true, filterMode: 'text' },
                  { field: 'value', header: 'القيمة', filter: true, filterMode: 'text' },
                  { field: 'benefitPeriodName', header: 'مدة الاستفادة', filter: true, filterMode: 'text' },
                  { field: 'benefitTypeName', header: 'نوع الاستفادة', filter: true, filterMode: 'text' },
                  { field: 'notes', header: 'ملاحظات', filter: true, filterMode: 'text' },
                
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
              AddEditServiceDetailComponent,
              row ? 'تعديل  تفاصيل الخدمة' : 'اضافة  تفاصيل الخدمة',
              { id: row?.id ?? null, developmentServiceId: this.developmentServiceId }
          );
      }
  
      openViewDialog(rowData: any) {
          this.openDialog(
             ServiceDetailComponent ,
              'عرض تفاصيل الخدمة',
              { pageType: 'view', row: { rowData } },
              { closable: true }
          );
      }
  
      override ngOnDestroy() {
          this.destroy$.next(true);
          this.destroy$.unsubscribe();
      }
  }
  
  