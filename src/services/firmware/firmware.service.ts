import { Injectable } from '@angular/core';
import { ApiService } from '../index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirmwareService {
  public path: string = '/Firmware';

  constructor(private api: ApiService) {}

  public isNewVersionAvailable(version: string): Observable<any> {
    return this.api.get(`${this.path}/isNewVersionAvailable?version=${version}`)
      .map((res: any) => res);
  }

  public getLastVersionDownloadInfo(): Observable<any> {
    return this.api.get(`${this.path}/getLastVersionDownloadInfo`)
      .map((res: any) => res);
  }
}
