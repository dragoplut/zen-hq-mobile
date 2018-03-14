import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../';
import 'rxjs/add/operator/map';
import {APP_USER} from "../../app/constants";
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Injectable()
export class GroupingService {
  public path: string = '/group';
  // public clinicAllowedFields: any[] = [
  //   'id'
  // ];

  constructor(
    private api: ApiService
  ) {}

  // public createClinic(data: any): Observable<any> {
  //   const clinicData: any = _.pick(data, this.clinicAllowedFields);
  //   return this.api.post(`${this.path}/create`, clinicData);
  // }

  public getGroup(id?: string): Observable<any> {
    const userString: string = localStorage.getItem(APP_USER);
    const user: any = userString && userString.length ? JSON.parse(atob(userString)) : {};
    return this.api.get(`${this.path}/${id || user.group}`).map((res: any) => res);
  }

  public getGroupChildren(id?: string): Observable<any> {
    const userString: string = localStorage.getItem(APP_USER);
    const user: any = userString && userString.length ? JSON.parse(atob(userString)) : {};
    return this.api.get(`${this.path}/${id || user.group}/children?depth=1`).map((res: any) => res);
  }

  public getGroupDevices(id: string): Observable<any> {
    return this.api.get(`${this.path}/${id}/devices/search?extraStatus=all`).map((res: any) => res);
  }

  // public updateGroup(data: any): Observable<any> {
  //   const clinicData: any = _.pick(data, this.clinicAllowedFields);
  //   return this.api.post(`${this.path}/update`, clinicData);
  // }

  public createGroup(data: any): Observable<any> {
    return this.api.post(`${this.path}`, { data });
  }

  public updateGroup(group: any): Observable<any> {
    const data: any = _.pick(group, [
      'title',
      'utcOffset',
      'location',
      'hubs'
    ]);
    return this.api.put(`${this.path}/${group.id}`, { data });
  }

  public getGroups(): Observable<any> {
    return this.api.get(`${this.path}/clinics`)
      .map((res: any) => res);
  }

  public getGroupsSearch(search: string): Observable<any> {
    return this.api.get(`${this.path}/clinicsSearch?search=${search}`)
      .map((res: any) => res);
  }

  public deleteGroup(id: string | number): Observable<any> {
    return this.api.post(`${this.path}/delete`, { id });
  }
}
