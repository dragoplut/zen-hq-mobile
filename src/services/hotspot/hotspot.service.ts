import { Injectable } from '@angular/core';
import { Hotspot, HotspotNetwork, HotspotDevice } from '@ionic-native/hotspot';
import 'rxjs/add/operator/map';
// noinspection TypeScriptCheckImport
// import * as _ from 'lodash';

@Injectable()
export class HotspotService {

  constructor(private hotspot: Hotspot) {}

  /**
   * Scan wifi hotspot networks
   * @param callback
   * @param reject
   */
  public scanNetworks(callback: any, reject?: any) {
    this.hotspot.scanWifi().then(
      (networks: Array<HotspotNetwork>) => {
        console.log(".........hotspot networks DONE ..........",JSON.stringify(networks));
        if (callback) {
          callback(networks);
        }
      },
      (err: any) => {
        console.log(".........hotspot networks ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }

  /**
   * Scan wifi hotspot devices
   * @param callback
   * @param reject
   */
  public scanDevices(callback: any, reject?: any) {
    this.hotspot.getAllHotspotDevices().then(
      (devices: Array<HotspotDevice>) => {
        console.log(".........hotspot devices DONE ..........",JSON.stringify(devices));
        if (callback) {
          callback(devices);
        }
      },
      (err: any) => {
        console.log(".........hotspot devices ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }

  /**
   * Connect to wifi with provided credentials
   * @param cred
   * @param callback
   * @param reject
   */
  public connectToWifi(cred: any, callback: any, reject?: any) {
    this.hotspot.connectToWifi(cred.ssid, cred.password).then(
      (resp: any) => {
        console.log(".........hotspot connectToWifi DONE ..........",JSON.stringify(resp));
        if (callback) {
          callback(resp);
        }
      },
      (err: any) => {
        console.log(".........hotspot connectToWifi ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }

  /**
   * Check if hotspot is connected to internet
   * @param callback
   * @param reject
   */
  public isConnectedToInternet(callback: any, reject?: any) {
    this.hotspot.isConnectedToInternet().then(
      (resp: any) => {
        console.log(".........hotspot isConnectedToInternet DONE ..........",JSON.stringify(resp));
        if (callback) {
          callback(resp);
        }
      },
      (err: any) => {
        console.log(".........hotspot isConnectedToInternet ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }

  /**
   * Check if wifi is on
   * @param callback
   * @param reject
   */
  public isWifiOn(callback: any, reject?: any) {
    this.hotspot.isWifiOn().then(
      (resp: any) => {
        console.log(".........hotspot isWifiOn DONE ..........",JSON.stringify(resp));
        if (callback) {
          callback(resp);
        }
      },
      (err: any) => {
        console.log(".........hotspot isWifiOn ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }

  /**
   * Get connection info
   * @param callback
   * @param reject
   */
  public getConnectionInfo(callback: any, reject?: any) {
    this.hotspot.getConnectionInfo().then(
      (resp: any) => {
        console.log(".........hotspot getConnectionInfo DONE ..........",JSON.stringify(resp));
        if (callback) {
          callback(resp);
        }
      },
      (err: any) => {
        console.log(".........hotspot getConnectionInfo ERR ..........",JSON.stringify(err));
        if (reject) {
          reject(err);
        }
      }
    );
  }
}
