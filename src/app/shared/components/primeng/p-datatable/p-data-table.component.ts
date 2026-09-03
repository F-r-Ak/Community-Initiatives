import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, inject, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ExportExcelService } from '../../../services/export-excel/export-excel.service';
import { TableOptions } from '../../../interfaces';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { PrimeDeleteDialogComponent } from '../p-delete-dialog/p-delete-dialog.component';
import { Button } from 'primeng/button';
import { TimeFormatPipe } from '../../../pipes';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { EnumDto } from '../../../interfaces/enum/enum';

@Component({
    selector: 'app-prime-data-table',
    standalone: true,
    imports: [TableModule, NgClass, RouterModule, PrimeDeleteDialogComponent, DatePipe, Button, CommonModule, TimeFormatPipe, AutoCompleteModule, FormsModule],
    templateUrl: './p-data-table.component.html',
    styleUrls: ['./p-data-table.component.scss']
})
export class PrimeDataTableComponent implements OnInit, OnDestroy {
    @Input() tableOptions!: TableOptions;
    @Input() totalCount: number = 0;
    @Input() pageSize: number = 0;
    @Input() checkbox: boolean = false;
    @Input() expandable: boolean = false;
    @Input() rowExpansionTemplate?: TemplateRef<any>;
    @Input() set data(value) {
        this._data.next(value);
    }

    get data() {
        return this._data.getValue();
    }

    @Output() event: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRowExpand: EventEmitter<any> = new EventEmitter();
    @Output() onRowCollapse: EventEmitter<any> = new EventEmitter();
    @Output() onAttachmentDownload: EventEmitter<any> = new EventEmitter();

    expandedRows: any = {};
    finalData: any[] = [];
    permissions: any = {};
    Showing: string = 'Showing';
    language!: string;
    deleteDialog: boolean = false;
    rowId!: string;
    rowRoute!: string;
    selected: any = '';
    Array = Array; // Expose Array for template use

    // Enum filter state: keyed by filterColumnName
    enumSuggestions: { [key: string]: EnumDto[] } = {};
    enumSelected: { [key: string]: EnumDto | null } = {};

    currentRoute;
    private _data = new BehaviorSubject<any[]>([]);
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private filterInput$ = new Subject<{ value: string; column: string }>();

    router = inject(Router);
    excel = inject(ExportExcelService);

    constructor() {
        this.currentRoute = this.router.url.substring(0, this.router.url.length - 3);
    }

    ngOnInit(): void {
        this.permissions = this.tableOptions.permissions;
        this._data.subscribe((x) => {
            this.finalData = this.data;
            console.log('DataTable data:', this.finalData); // Debug log
        });

        // Load enum options for enum-filter columns
        const cols = this.tableOptions.inputCols ?? [];
        cols.forEach(col => {
            if (col.filterMode === 'enum' && col.filterOptions$ && col.filterColumnName) {
                col.filterOptions$.subscribe(options => {
                    this.enumSuggestions[col.filterColumnName!] = options;
                });
                this.enumSelected[col.filterColumnName!] = null;
            }
        });

        // Debounce filter inputs so server is called only after user stops typing
        this.filterInput$
            .pipe(
                debounceTime(800),
                distinctUntilChanged((prev, curr) => prev.value === curr.value && prev.column === curr.column),
                takeUntil(this.destroy$)
            )
            .subscribe(({ value, column }) => {
                this.event.emit({ eventType: 'filter', value, column });
            });
    }

    loadLazyLoadedData($event: any): void {
        this.event.emit({ data: $event, eventType: 'lazyLoad' });
    }

    getCellData(row: any, col: any): any {
        const nestedProperties: string[] = col.field.split('.');
        let value: any = row;
        for (const prop of nestedProperties) {
            if (value[prop] == null) {
                return '';
            }
            value = value[prop];
        }
        return value;
    }

    filter(event: Event, col: any): void {
        const value = (event.target as HTMLInputElement).value;
        const column = col.filterColumnName ?? col.field;
        this.filterInput$.next({ value, column });
    }

    // Autocomplete search — filters suggestions client-side from already-loaded enum list
    searchEnumSuggestions(event: any, col: any): void {
        const key = col.filterColumnName!;
        const all: EnumDto[] = this.enumSuggestions[key] ?? [];
        const query = (event.query ?? '').toLowerCase();
        // Replace the suggestions array reference so PrimeNG detects the change
        this.enumSuggestions = {
            ...this.enumSuggestions,
            [key]: query ? all.filter(o => o.nameAr.toLowerCase().includes(query)) : [...all]
        };
    }

    onEnumSelect(item: EnumDto, col: any): void {
        const column = col.filterColumnName ?? col.field;
        this.event.emit({ eventType: 'filter', value: item.code, column });
    }

    onEnumClear(col: any): void {
        const column = col.filterColumnName ?? col.field;
        this.enumSelected[column] = null;
        this.event.emit({ eventType: 'filter', value: '', column });
    }

    delete(id: any): void {
        this.deleteDialog = true;
        this.rowId = id;
        console.log('Delete rowId:', this.rowId); // Debug log
    }

    modalClosed(isClosed: boolean) {
        if (isClosed) {
            if (this.selected && this.selected.length > 0) {
                const idsToDelete = this.selected.map((item: any) => item.id);
                this.deleteData(idsToDelete);
            } else {
                this.event.emit({ data: this.rowId, eventType: 'delete' });
            }
        }
        this.deleteDialog = false;
    }

    deleteSelected() {
        this.deleteDialog = true;
    }

    deleteData(ids: string[]) {
        this.event.emit({ data: ids, eventType: 'deleteRange' });
        console.log('IDs to be deleted:', ids); // Debug log
    }

    export(columnNames: any, reportName: any): void {
        this.event.emit({ data: columnNames, reportName, eventType: 'export' });
    }

    handleLinkClick(row: any, col: any) {
        console.log('Link clicked:', { row, col }); // Debug log
        if (this.permissions.listOfPermissions.indexOf('Permission.' + this.permissions.componentName + '.Edit') > -1) {
            this.router.navigate([col.route + row.id]);
        } else if (this.permissions.listOfPermissions.indexOf('Permission.' + this.permissions.componentName + '.View') > -1) {
            this.router.navigate([col.viewRoute + row.id]);
        }
    }

    handleRowExpand(event: any) {
        console.log('Row expanded:', event, 'Expanded rows:', this.expandedRows); // Debug log
        this.onRowExpand.emit(event);
    }

    handleRowCollapse(event: any) {
        console.log('Row collapsed:', event); // Debug log
        this.onRowCollapse.emit(event);
    }

    /**
     * Handle attachment click event
     * @param attachment The attachment to download
     * @param event The click event
     */
    onAttachmentClick(attachment: any, event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.onAttachmentDownload.emit(attachment);
    }

    get colSpan(): number {
        let count = this.tableOptions.inputCols?.length || 0;
        if (this.checkbox) count++;
        if (this.expandable) count++;
        const hasActions = this.tableOptions.inputActions && (this.permissions.allowAll || this.permissions.listOfPermissions.indexOf('Permission.' + this.permissions.componentName + '.View') > -1);
        if (hasActions) count++;
        return count;
    }

    ngOnDestroy() {
        this.event.emit({ eventType: 'reset' });
        this._data.unsubscribe();
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
