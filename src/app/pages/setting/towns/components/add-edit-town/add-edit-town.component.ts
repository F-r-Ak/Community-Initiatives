import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, TownsService, CitiesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-town',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent],
    templateUrl: './add-edit-town.component.html',
    styleUrl: './add-edit-town.component.scss'
})
export class AddEditTownComponent extends BaseEditComponent implements OnInit {
    townsService: TownsService = inject(TownsService);
    citiesService: CitiesService = inject(CitiesService);
    dialogService: DialogService = inject(DialogService);

    selectedCity: any;
    filteredCities: any[] = [];

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
        if (this.pageType === 'edit') {
            this.getEditTown();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            cityId: [null, Validators.required],
            nameAr: ['', Validators.required]
        });
    }

    getCities(body: any) {
        return this.citiesService.getDropDown(body);
    }

    onCitySelect(event: any) {
        this.selectedCity = event.value;
        this.form.get('cityId')?.setValue(this.selectedCity?.id);
    }

    onCityClear(){
        this.selectedCity = null;
        this.form.get('cityId')?.reset();
    }

    getEditTown = () => {
        this.townsService.getEditTown(this.id).subscribe((town: any) => {
            this.initFormGroup();
            this.form.patchValue(town);
            this.fetchCityDetails(town?.cityId);
        });
    };

    fetchCityDetails(cityId: any) {
        this.citiesService.getCity(cityId).subscribe((cityDetails: any) => {
            this.selectedCity = cityDetails?.data || cityDetails;
            this.form.patchValue({
                cityId: cityDetails?.data?.id || cityDetails?.id
            });
        });
    }

    submit() {
        if (this.pageType === 'add')
            this.townsService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.townsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
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
