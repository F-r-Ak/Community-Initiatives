export interface EnumsGenItemDto {
  value: number;
  name: string;
  nameEn: string;
  nameAr: string;
  code: string | null;
}

export interface EnumsGenResponse {
  BenefitPeriod: EnumsGenItemDto[];
  DevelopmentEntityType: EnumsGenItemDto[];
  EntityType: EnumsGenItemDto[];
  ExecutionStatus: EnumsGenItemDto[];
  Gender: EnumsGenItemDto[];
  HttpStatusCode: EnumsGenItemDto[];
  InitiativeCategory: EnumsGenItemDto[];
  JobStatus: EnumsGenItemDto[];
  Support: EnumsGenItemDto[];
  TeamCategory: EnumsGenItemDto[];
  [key: string]: EnumsGenItemDto[] | undefined;
}
