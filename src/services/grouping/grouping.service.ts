import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../';
import 'rxjs/add/operator/map';
import {APP_USER} from "../../app/constants";
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable()
export class GroupingService {
  public path: string = '/group';
  // public clinicAllowedFields: any[] = [
  //   'id'
  // ];

  constructor(
    private api: ApiService,
    private http: Http
  ) {}

  // public createClinic(data: any): Observable<any> {
  //   const clinicData: any = _.pick(data, this.clinicAllowedFields);
  //   return this.api.post(`${this.path}/create`, clinicData);
  // }

  public getGroup(id?: string): Observable<any> {
    const userString: string = localStorage.getItem(APP_USER);
    const user: any = userString && userString.length ? JSON.parse(atob(userString)) : {};
    return this.api.get(`${this.path}/${id || user.group}?parents=true`).map((res: any) => res);
  }

  public getGroupChildren(id?: string): Observable<any> {
    const userString: string = localStorage.getItem(APP_USER);
    const user: any = userString && userString.length ? JSON.parse(atob(userString)) : {};
    return this.api.get(`${this.path}/${id || user.group}/children?depth=1`).map((res: any) => res);
  }

  public getGroupDevices(id: string): Observable<any> {
    return this.api.get(`${this.path}/${id}/devices/search?extraStatus=all`).map((res: any) => res);
  }

  public getGroupEvents(id: string): Observable<any> {
    return this.api.get(`${this.path}/${id}/events?ghost=true`).map((res: any) => res);
  }

  public getUnusedDevices(id: string): Observable<any> {
    return this.api.get(`${this.path}/${id}/devices/unused`).map((res: any) => res);
  }

  // public updateGroup(data: any): Observable<any> {
  //   const clinicData: any = _.pick(data, this.clinicAllowedFields);
  //   return this.api.post(`${this.path}/update`, clinicData);
  // }

  public createGroup(data: any): Observable<any> {
    return this.api.post(`${this.path}`, { data });
  }

  public createEvent(data: any, groupId: string): Observable<any> {
    return this.api.post(`${this.path}/${groupId}/event`, { data });
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

  public deleteGroup(id: string | number): Observable<any> {
    return this.api.post(`${this.path}/delete`, { id });
  }

  public provision(id: string, data: any): Observable<any> {
    return this.api.post(`${this.path}/${id}/zengine/provision`, { data });
  }

  public assignDeviceToGroup(groupId: string, device: any): Observable<any> {
    return this.api.post(`${this.path}/${groupId}/device/${device.deviceId}`, {});
  }

  public setConfiguration (data: any): Observable<any> {
    let host: string = 'http://zen.net';

    // let data = {
    //     "__SL_P_UPA": "",
    //     "__SL_P_UNA": "VK",
    //     "__SL_P_UNB": "VK9999VK",
    //     "__SL_P_UHA": "zen-int-hub.azure-devices.net",
    //     "__SL_P_UHB": "8883",
    //     "__SL_P_UHC": "JYQB6bZHZEOaSib",
    //     "__SL_P_UHD": "SharedAccessSignature sr=zen-int-hub.azure-",
    //     "__SL_P_UHE": "devices.net%2Fdevices%2Fk42tnQ1RRsaIAv9v8Fky",
    //     "__SL_P_UHF": "yktn1cmgjv%252Fm&sig=zb5ocXW%2Bv0rf1cxe4DQM",
    //     "__SL_P_UHG": "LkGgnJQAkW6J44NTM7qK4wE%3D&se=1550148946",
    //     "__SL_P_UPZ": ""
    // }

    let tokenLength: number = data.device.sasToken.length;
    let acceptableMax: number = tokenLength / 4 + 1;
    let startingIndex: number = 0;
    let endingIndex: number = startingIndex + acceptableMax;

    let tokenParts: any[] = [];

    while (endingIndex < tokenLength) {
      tokenParts.push(data.device.sasToken.substring(startingIndex, endingIndex));

      startingIndex = endingIndex;
      endingIndex += acceptableMax;
    }

    if (startingIndex < tokenLength) {
      tokenParts.push(data.device.sasToken.substring(startingIndex));
    }

    let config: any = {
      '__SL_P_UPA': '',
      '__SL_P_UNA': data.network.ssid,
      '__SL_P_UNB': data.network.password,
      '__SL_P_UHA': data.device.iotHubHostname,
      '__SL_P_UHB': data.device.iotHubPort,
      '__SL_P_UHC': data.device.deviceSecondaryId,
      '__SL_P_UHD': tokenParts[0],
      '__SL_P_UHE': tokenParts[1],
      '__SL_P_UHF': tokenParts[2],
      '__SL_P_UHG': tokenParts[3],
      '__SL_P_UPZ': ''
    };

    console.info('Set: ', config);

    return this.http.post(
      `${host}/profiles_add.html`,
      this.transformRequest(config),
      new RequestOptions({
        headers: new Headers({
          'content-type': 'application/x-www-form-urlencoded'
        })
      })
    )
      .map(this.api.checkForError)
      .catch((err: any) => Observable.throw(err))
      .map(this.api.getJson);

    // Original http request from hq.zenhq.com web front-end
    // return $http({
    //   url: host + '/profiles_add.html',
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   transformRequest: function(obj) {
    //     let str = [];
    //     for (let p in obj)
    //       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //     return str.join("&");
    //   },
    //   data: config
    // }).then(function(resp) {
    //   return resp.data;
    // }).catch(function(err) {
    //   return err;
    // });
  };

  private transformRequest(obj: any) {
    let str = [];
    for (let p in obj)
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  }
}
