import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';
import { EnumDto, EnumsGenItemDto, EnumsGenResponse } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EnumsGenService extends HttpService {
  protected get baseUrl(): string {
        return 'v1/';
    }

    /**
     * Single cached HTTP call. All callers share the same response — no extra
     * network requests on repeated access or across components.
     */
    private _cache$?: Observable<EnumsGenResponse>;

    private get allEnums$(): Observable<EnumsGenResponse> {
        if (!this._cache$) {
            this._cache$ = this.get<EnumsGenResponse>({ apiName: 'enums-gen' }).pipe(
                shareReplay(1)
            );
        }
        return this._cache$;
    }

    /**
     * Returns an observable of EnumDto[] for a given enum key.
     * Maps EnumsGenItemDto → EnumDto so the rest of the app keeps working unchanged.
     *
     * @param key - one of the top-level keys in the enums-gen response, e.g.
     */
    getByKey(key: keyof EnumsGenResponse): Observable<EnumDto[]> {
        return this.allEnums$.pipe(
            map((res) => {
                const items: EnumsGenItemDto[] = res[key] ?? [];
                return items.map((item) => ({
                    id: String(item.value),
                    nameEn: item.nameEn ?? item.name,
                    nameAr: item.nameAr ?? item.name,
                    code: item.code ?? item.name
                }));
            })
        );
    }

    // ---------------------------------------------------------------------------
    // Named convenience getters — one per enum used in filterOptions$ across the app
    // ---------------------------------------------------------------------------

    get BenefitPeriods$(): Observable<EnumDto[]> {
        return this.getByKey('BenefitPeriod');
    }

    get DevelopmentEntityTypes$(): Observable<EnumDto[]> {
        return this.getByKey('DevelopmentEntityType');
    }

    get EntityTypes$(): Observable<EnumDto[]> {
        return this.getByKey('EntityType');
    }

    get ExecutionStatuses$(): Observable<EnumDto[]> {
        return this.getByKey('ExecutionStatus');
    }

    get Genders$(): Observable<EnumDto[]> {
        return this.getByKey('Gender');
    }

    get HttpStatusCodes$(): Observable<EnumDto[]> {
        return this.getByKey('HttpStatusCode');
    }

    get InitiativeCategories$(): Observable<EnumDto[]> {
        return this.getByKey('InitiativeCategory');
    }

    get JobStatuses$(): Observable<EnumDto[]> {
        return this.getByKey('JobStatus');
    }

    get Supports$(): Observable<EnumDto[]> {
        return this.getByKey('Support');
    }

    get TeamCategories$(): Observable<EnumDto[]> {
        return this.getByKey('TeamCategory');
    }
}
