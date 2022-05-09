import { NPSCategoriesWardsAndSubjectsDTO } from '../../modules/nps/model/nps-categories-wards-and-subjects.dto';
import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {  Observable } from 'rxjs';
import { NPSCategoryGlobalSatisfactionDTO } from '../../modules/nps/model/nps-category-global-satisfaction.dto';
import { FakeDataService } from '../fake-data/fake-data.service';
import { NPSClosedOrderDTO } from '../../modules/nps/model/nps-closed-order.dto';
import { NPSCategoryDTO } from '../../modules/nps/model/nps-by-category.dto';
import { NPSCategoryLowerThanSevenDTO } from '../../modules/nps/model/nps-category-lower-than-seven.dto';

@Injectable({
  providedIn: 'root'
})
export class NPSEventService {

  private propertyId: string;
  private eventsUrl: string;

  constructor(private http: HttpClient, private propertiesService: PropertiesService, private fakeDataService: FakeDataService, private translateService: TranslateService) {
    this.propertiesService.getAppConfig().subscribe(response => {
      this.propertyId = response.propertyId;
      this.eventsUrl = response.eventsUrl;
    });
  }

  findEventsGlobalSatisfaction(start: number, end: number, category: string, sector: string, ward: string, subject: string): Observable<NPSCategoryGlobalSatisfactionDTO> {
    const categoryParam = category ? `category=${category}` : '';
    const sectorParam = sector ? `sector=${sector}` : '';
    const wardParam = ward ? `ward=${ward}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${categoryParam}&${sectorParam}&${wardParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<NPSCategoryGlobalSatisfactionDTO>(`${this.eventsUrl}/nps/global-satisfaction/${this.propertyId}?${params}`);
  }

  findCategoriesNPSLowerThanSeven(start: number, end: number, category: string, sector: string, ward: string, subject: string): Observable<NPSCategoryLowerThanSevenDTO> {
    const categoryParam = category ? `category=${category}` : '';
    const sectorParam = sector ? `sector=${sector}` : '';
    const wardParam = ward ? `ward=${ward}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${categoryParam}&${sectorParam}&${wardParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<NPSCategoryLowerThanSevenDTO>(`${this.eventsUrl}/nps/lowers-than-seven/${this.propertyId}?${params}`);
  }

  findNPSClosedOrders(start: number, end: number, category: string, sector: string, ward: string, subject: string): Observable<NPSClosedOrderDTO> {
    const categoryParam = category ? `category=${category}` : '';
    const sectorParam = sector ? `sector=${sector}` : '';
    const wardParam = ward ? `ward=${ward}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${categoryParam}&${sectorParam}&${wardParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<NPSClosedOrderDTO>(`${this.eventsUrl}/nps/closed-orders/${this.propertyId}?${params}`);
  }

  findNPSByCategory(start: number, end: number, category: string, sector: string, ward: string, subject: string): Observable<NPSCategoryDTO> {
    const categoryParam = category ? `category=${category}` : '';
    const sectorParam = sector ? `sector=${sector}` : '';
    const wardParam = ward ? `ward=${ward}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${categoryParam}&${sectorParam}&${wardParam}&${subjectParam}&${startTime}&${endTime}`;


    return this.http.get<NPSCategoryDTO>(`${this.eventsUrl}/nps/by-category/${this.propertyId}?${params}`);
  }

  getCategoriesAndSubjects(): Observable<NPSCategoriesWardsAndSubjectsDTO> {
    return this.http.get<NPSCategoriesWardsAndSubjectsDTO>(`${this.eventsUrl}/nps/categories-subjects/${this.propertyId}`);
  }

}