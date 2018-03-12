import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ZENHQ_LOGO_TRANSPARENT } from '../../app/constants';
import { HomeMenu } from '../index';
import { AccountService, BleService, PenService } from '../../services';

import * as moment from 'moment';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'update-pen',
  templateUrl: 'update.html'
})
export class UpdatePenComponent {

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;

  public userInfo: any = {};
  public dpDevice: any = { name: '' };
  public errorData: any = '';
  public successData: any = '';
  public logData: any[] = [];
  public rawData: any = [];
  public decodedData: any = '';
  public pairingDevice: any = 'No data yet!';
  public errorDescription: any = '';

  public deviceValues: any = {};

  public unpairedDevices: any[] = [];
  public pairedDevices: any[] = [];
  public gettingDevices: boolean = false;

  public dependencies: any = {};

  public updatePercent: number = 0;
  public requestItemValue: number = 0;
  public requestItems: any[] = [
    { viewValue: 'None', value: 0 },
    { viewValue: 'Usage List', value: 1 },
    { viewValue: 'Error List', value: 2 },
    { viewValue: 'Black List', value: 3 },
    { viewValue: 'Firmware Image', value: 4 },
    { viewValue: 'Settings', value: 5 }
  ];

  public deviceInterface: any = {
    services: [ '1800', '1801', 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e', '180a' ],
    characteristics: [
      {
        name: '',
        service: '1800',
        characteristic: '2a00',
        properties: [ 'Read', 'Write' ]
      },
      {
        name: '',
        service: '1800',
        characteristic: '2a01',
        properties: [ 'Read' ]
      },
      {
        name: '',
        service: '1800',
        characteristic: '2a04',
        properties: [ 'Read' ]
      },
      {
        name: '',
        service: '1801',
        characteristic: '2a05',
        properties: [ 'Indicate' ],
        descriptors: [ { uuid: '2902' } ]
      },
      {
        type: 'unit8',
        name: 'Brightness',
        service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
        characteristic: 'a8a91001-38e9-4fbe-83f3-d82aae6ff68e',
        properties: [ 'Read', 'Write' ]
      },
      {
        type: 'unit8',
        name: 'Volume',
        service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
        characteristic: 'a8a91002-38e9-4fbe-83f3-d82aae6ff68e',
        properties: [ 'Read', 'Write' ]
      },
      // {
      //   type: 'fileRequest',
      //   name: 'File Request',
      //   service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
      //   characteristic: 'a8a91003-38e9-4fbe-83f3-d82aae6ff68e',
      //   properties: [ 'Write' ]
      // },
      // {
      //   type: 'fileResponse',
      //   name: 'File Response',
      //   service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
      //   characteristic: 'a8a91004-38e9-4fbe-83f3-d82aae6ff68e',
      //   properties: [ 'Read', 'Notify' ],
      //   descriptors: [ { uuid: '2902' } ]
      // },
      // {
      //   type: 'fileReadBuffer',
      //   name: 'File Read Buffer',
      //   service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
      //   characteristic: 'a8a91005-38e9-4fbe-83f3-d82aae6ff68e',
      //   properties: [ 'Read', 'Notify' ],
      //   descriptors: [ { uuid: '2902' } ]
      // },
      // {
      //   type: 'fileWriteBuffer',
      //   name: 'File Write Buffer',
      //   service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
      //   characteristic: 'a8a91006-38e9-4fbe-83f3-d82aae6ff68e',
      //   properties: [ 'WriteWithoutResponse', 'Write' ]
      // },
      // {
      //   type: 'unit8',
      //   name: 'Key Info',
      //   service: 'a8a91000-38e9-4fbe-83f3-d82aae6ff68e',
      //   characteristic: 'a8a91007-38e9-4fbe-83f3-d82aae6ff68e',
      //   properties: [ 'Read' ]
      // },
      {
        type: 'string',
        name: 'Manufacturer Name String',
        service: '180a',
        characteristic: '2a29',
        properties: [ 'Read' ]
      },
      {
        type: 'string',
        name: 'Model Number String',
        service: '180a',
        characteristic: '2a24',
        properties: [ 'Read' ]
      },
      {
        type: 'string',
        name: 'Serial Number String',
        service: '180a',
        characteristic: '2a25',
        properties: [ 'Read' ]
      },
      {
        type: 'string',
        name: 'Hardware Revision String',
        service: '180a',
        characteristic: '2a27',
        properties: [ 'Read' ]
      },
      {
        type: 'string',
        name: 'Firmware Revision String',
        service: '180a',
        characteristic: '2a26',
        properties: [ 'Read' ]
      },
      {
        type: 'string',
        name: 'Software Revision String',
        service: '180a',
        characteristic: '2a28',
        properties: [ 'Read' ]
      }
    ]
  };

  public charElem: any = {
    'a8a91003-38e9-4fbe-83f3-d82aae6ff68e': {
      file: {
        none: 0,
        usage_list: 1,
        error_list: 2,
        black_list: 3,
        firmware_image: 4,
        settings: 5
      },
      action: {
        none: 0,
        size: 1,
        write: 2,
        read: 3,
        not_used: 4,
        done: 5,
        abort: 6
      }
    },
    'a8a91004-38e9-4fbe-83f3-d82aae6ff68e': {
      file: {
        none: 0,
        usage_list: 1,
        error_list: 2,
        black_list: 3,
        firmware_image: 4,
        settings: 5
      },
      action: {
        size: 1,
        not_used1: 2,
        read: 3,
        pause: 4,
        done: 5,
        not_used2: 6,
        timeout: 7,
        error: 8
      }
    }
  };

  public timeNowSeconds: number = moment().diff(moment().year(2017).startOf('year'), 'seconds');
  public dummyWhiteBlackList: any[] = [0,0,1,1,2,3,4,6,7,300];
  public dummySettings: any[] = [
    123456,
    this.timeNowSeconds,
    this.timeNowSeconds + (24 * 60 * 60),
    this.timeNowSeconds + (7 * 24 * 60 * 60)
  ];
  public dummyDeviceSettings: any = {
    userId: 123456,
    currentDateTime: this.timeNowSeconds,
    warnSyncDateTime: this.timeNowSeconds + (24 * 60 * 60),
    forceSyncDateTime: this.timeNowSeconds + (7 * 24 * 60 * 60)
  };

  public hasProp: any = (arr: any[], prop: string) => _.includes(arr, prop);

  constructor(
    public _account: AccountService,
    public _ble: BleService,
    public _pen: PenService,
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {}

  public ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.updateUserInfo();
      this.updateBlackWhiteList();
      this._ble.enable();
      this.dependencies = this.navParams.get('dependencies') || {};
      this.dpDevice = { name: '' };
      if (this.dependencies && this.dependencies.pen && !this.dependencies.clinic) {
        if (this.dpDevice) {
          this.dpDevice.name = this.dependencies.pen.serialNumber;
          this.dpDevice.id = this.dependencies.pen.serialNumber;
          this.dpDevice.serialNumber = this.dependencies.pen.serialNumber;
        } else {
          this.dpDevice = {
            id: this.dependencies.pen.serialNumber,
            name: this.dependencies.pen.serialNumber,
            serialNumber: this.dependencies.pen.serialNumber
          };
        }
        this.initConnectionChecker();
        this._ble.scan(this.dpDevice || {}, (resp: any) => {
          // this._ble.discoverableSec(60);
          this._ble.connect(this.dpDevice, this.connected, false);
        }, this._ble.stopScan);
      } else {
        this.startScanning();
      }
    });
  }

  public startScanning(existingDevice?: any) {
    this.initConnectionChecker();

    this._ble.stopScan();
    this._ble.scan(existingDevice || {}, (resp: any) => this.scanSuccess(resp), this.fail);
  }

  public connected = (data: any) => {
    this.successData = JSON.stringify(data);
    this.errorData = '';
    this.dpDevice = data;
    this._ble.isConnected(
      this.dpDevice,
      (resp: any) => {
        this.dpDevice.paired = true;
        this.writeToDevice(this.dpDevice, '180a', '2a26', 0);
      }, (err: any) => {
        this.dpDevice.paired = false;
      });
  };

  public disconnected = (data: any) => {
    this.successData = JSON.stringify(data);
    this.errorData = '';
    this.dpDevice.paired = false;
    //this.startScanning();
  };

  public success = (data: any, customInfo?: string, params?: any[]) => {
    // alert(data);
    this.successData = JSON.stringify(data);
    this.errorData = '';
    //alert('success: ' + this.successData);
    const log: string = (new Date()).toISOString() + ' Success: ' + customInfo + ' ' + JSON.stringify(data, null, 2);
    this.logData.push(log);
    // if (params && params.length && params[1] === 2) {
    //   setTimeout(() => {
    //     this._ble.write();
    //   }, 200);
    // }
  };

  public fail = (error: any) => {
    this._ble.stopScan();
    this.gettingDevices = false;
    this.errorData = JSON.stringify(error);
    this.successData = '';
    // alert('fail: ' + this.errorData);
    const log: string = (new Date()).toISOString() + ' Error: ' + JSON.stringify(error, null, 2);
    this.logData.push(log);
  };

  public selectDevice(address: string, device?: any) {
    if (device) {
      this.pairingDevice = JSON.stringify(device);
    }

    let alert: any = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this._ble.connect(device, this.connected, this.fail);
          }
        }
      ]
    });
    alert.present();

  }

  public disconnect() {
    let alert: any = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this._ble.disconnect(this.dpDevice, this.disconnected, this.fail);
          }
        }
      ]
    });
    alert.present();
  }

  public alertOk(text: string) {
    let alert: any = this.alertCtrl.create({
      title: 'Message',
      message: text,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  public readFromDevice(address: any, serviceUUID: string, characteristicUUID: string, type: string) {
    this._ble.read(address, { serviceUUID, characteristicUUID }, type, (done: any) => {
      this.success(done, 'readFromDevice ' + _.get(_.find(this.deviceInterface.characteristics, ['characteristic', characteristicUUID]), 'name'));
      setTimeout(() => this.alertOk(JSON.stringify(done)), 200);
    }, this.fail);
  }

  public writeToDevice(address: string, serviceUUID: string, characteristicUUID: string, rawData: any) {
    this._ble.write(address, { serviceUUID, characteristicUUID }, rawData, (done: any) => {
      this.success(done, 'writeToDevice ' + _.get(_.find(this.deviceInterface.characteristics, ['characteristic', characteristicUUID]), 'name'));
      setTimeout(() => this.alertOk(JSON.stringify(done)), 200);
    }, this.fail);
  }

  public writeWithResponse(address: string, item: any, rawData: any) {
    // this._ble.startNotification(
    //   address,
    //   { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91004-38e9-4fbe-83f3-d82aae6ff68e' },
    //   (data: any) => this.onFileResponse(data, address, item, rawData),
    //   (err: any) => this.onDataErr(address, { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91004-38e9-4fbe-83f3-d82aae6ff68e' }, err));
    // this._ble.startNotification(
    //   address,
    //   { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91005-38e9-4fbe-83f3-d82aae6ff68e' },
    //   (data: any) => this.onData(data, address, item, rawData),
    //   (err: any) => this.onDataErr(address, { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91005-38e9-4fbe-83f3-d82aae6ff68e' }, err));

    if (rawData && rawData.length) {
      // alert('writeWithResponse rawData[1]: ' + rawData[1] + ' - ' + JSON.stringify(rawData));
      switch (rawData[1]) {
        case 2:
          this._ble.startNotification(
            address,
            { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91004-38e9-4fbe-83f3-d82aae6ff68e' },
            (data: any) => this.onFileResponse(data, address, item, rawData),
            (err: any) => this.onDataErr(address, { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91004-38e9-4fbe-83f3-d82aae6ff68e' }, err));
          break;
        case 3:
          this._ble.startNotification(
            address,
            { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91005-38e9-4fbe-83f3-d82aae6ff68e' },
            (data: any) => this.onData(data, address, item, rawData),
            (err: any) => this.onDataErr(address, { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91005-38e9-4fbe-83f3-d82aae6ff68e' }, err));
          break;
        default:
          break;
      }
    }

    let resultViktor: any = [];
    const rangesArr: any[] = this.dummyWhiteBlackList;
    _.forEach(rangesArr, (num: any) => {
      // console.log('this.intToVarints128(num)', this.intToVarints128(num), num);
      resultViktor = resultViktor.concat(this.intToVarints128(num));
    });
    let resultViktorUint8: any = new Uint8Array(resultViktor);

    if (rawData[0] === 3 && rawData[1] === 2) {
      rawData[2] = resultViktorUint8.length;
    }

    // alert('writeWithResponse ' + JSON.stringify(item, null, 2));
    this._ble.write(address, { serviceUUID: item.serviceUUID, characteristicUUID: item.characteristicUUID, type: item.type }, rawData, (done: any) => {
      this.success(done, 'Write ' + JSON.stringify(rawData));
      if (rawData[1] === 2) {
        switch (rawData[0]) {
          case 3:
            this.updatePercent += 10;
            const packagesAmount: number = Math.ceil(resultViktor.length / 18);
            alert('packagesAmount: ' + packagesAmount);
            for (let i = 0; i < packagesAmount; i++) {
              const rawPackageData: any = resultViktorUint8.slice(i ? 18 * i - 1 : i, 18 * (i + 1));
              let packageData: any = new Uint8Array(18);
              _.forEach(rawPackageData, (item: any, idx: number) => packageData[idx] = item);
              alert('packageData: ' + JSON.stringify(packageData, null, 2));
              // if (packageData.length < 18) {
              //   const zeroPaddedBuffer: any = new Uint8Array(packageData.length - 18);
              //   packageData = this.concatTypedArrays(packageData, zeroPaddedBuffer);
              // }
              // alert('packageData: ' + JSON.stringify(packageData, null, 2));
              const packageNumber: any = new Uint8Array(2);
              packageNumber[0] = packagesAmount < 2 || i + 1 === packagesAmount ? 128 : i;
              const packageBuffer: any = this.concatTypedArrays(packageNumber, packageData);

              const log: string = (new Date()).toISOString() + ' packageBuffer: ' + JSON.stringify(packageBuffer, null, 2);
              this.logData.push(log);
              // alert('resultViktorUint8: ' + JSON.stringify(resultViktorUint8, null, 2));
              alert('packageBuffer: ' + JSON.stringify(packageBuffer, null, 2));

              this._ble.write(
                address,
                { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91006-38e9-4fbe-83f3-d82aae6ff68e', type: 'fileWriteBuffer' },
                packageBuffer,
                (done: any) => {
                  this.updatePercent += 40;
                  this.success(done, 'Write buffer ' + JSON.stringify(rawData));
                },
                this.fail
              );
            }

            break;
          case 4:
            break;
          case 5:
            this.updatePercent += 10;
            let rawBuffer: any = new Uint32Array(this.dummySettings);
            const packageNumber: any = new Uint8Array(2);
            packageNumber[0] = 128;
            const packageBuffer: any = this.concatTypedArrays(packageNumber, rawBuffer);
            alert('packageBuffer: ' + JSON.stringify(packageBuffer, null, 2));
            this._ble.write(
              address,
              { serviceUUID: item.serviceUUID, characteristicUUID: 'a8a91006-38e9-4fbe-83f3-d82aae6ff68e', type: 'fileWriteBuffer' },
              packageBuffer,
              (done: any) => {
                this.updatePercent += 40;
                this.success(done, 'Write buffer settings ' + JSON.stringify(rawData));
              },
              this.fail
            );
            break;
        }
      }
      // if (rawData[1] === 2) {
      //   if (rawData[0] === 5)
      //   setTimeout(() => {
      //
      //     this._ble.write(address, { serviceUUID: item.serviceUUID, characteristicUUID: item.characteristicUUID, type: item.type }, rawData, (done: any) => this.success(done, 'Write buffer ' + JSON.stringify(rawData)), this.fail);
      //   }, 200);
      // }
    }, this.fail);
  }

  public onFileResponse(data: any, address: string, item: any, rawData: any) {
    alert('onFileResponse ' + JSON.stringify(data, null, 2));
  }

  public onData(data: any, address: string, item: any, rawData: any) {
    // alert('onData: ' + JSON.stringify(data, null, 2));
    if (data && data.idx && data.idx.length && data.idx[1] === 0) {
      this.rawData = [];
    }
    for (let prop in data.data) {
      this.rawData.push(data.data[prop]);
    }
    this.successData = _.clone(this.rawData);
    if (data && data.idx && data.idx.length && data.idx[0] === 128) {
      const log: string = (new Date()).toISOString() + ' onData DONE (file receive success).';
      this.logData.push(log);
      // alert('DONE!!!!!!!!' + JSON.stringify(this.logData));
      const dataDone: any = _.clone(rawData);
      dataDone[1] = 5;
      this._ble.write(address, { serviceUUID: item.serviceUUID, characteristicUUID: item.characteristicUUID, type: item.type }, dataDone, (done: any) => {
        let resp: any = {};
        switch (dataDone[0]) {
          case 1:
            // this.decodeBuffer(this.rawData, 'usageList');
            // alert('usageList this.rawData: ' + JSON.stringify(this.rawData, null, 2));
            resp = this._pen.decodeBuffer(this.rawData, 'usageList');
            // alert('usageList resp: ' + JSON.stringify(resp, null, 2));
            break;
          case 2:
            // this.decodeBuffer(this.rawData, 'errorList');
            resp = this._pen.decodeBuffer(this.rawData, 'errorList');
            break;
          case 3:
            resp = this._pen.decodeBuffer(this.rawData, 'blackList');
            break;
          case 5:
            resp = this._pen.decodeBuffer(this.rawData, 'settings');
            break;
          default:
            break;
        }
        alert('decodeBuffer resp: ' + JSON.stringify(resp, null, 2));
        this.logData.push(resp.log);
        this.decodedData = _.clone(resp.result);
        this.successData = JSON.stringify(this.decodedData, null, 2);
        this.success(done, 'DONE ' + JSON.stringify(dataDone));
        this.logData.push('--------------------------------------');
        this.rawData = [];
        setTimeout(() => this.alertOk('Done'), 200);
      }, this.fail);
    }
    // const cartIdArr: any = new Uint8Array(buffer, 2, 3);
    // const cartId: any = (cartIdArr[0] << 16) | (cartIdArr[1] << 8) | cartIdArr[2];

  }

  public onDataErr(address: string, uuid: any, err: any) {
    // alert('onDataErr: ' + JSON.stringify(err));
    const log: string = (new Date()).toISOString() + ' onDataErr: ' + JSON.stringify(err, null, 2);
    this.logData.push(log);
    this._ble.stopNotification(address, uuid, this.success, this.fail);
  }

  // public decodeBuffer(data: any, type: string) {
  //   // alert('before decodeBuffer: ' + JSON.stringify(data, null, 2));
  //   let result: any[] = [];
  //   switch (type) {
  //     case 'errorList':
  //       const errorBlockLength: number = 12;
  //       const errorListItems: number = Math.ceil(this.rawData.length % errorBlockLength) + 1;
  //       // alert('errorListItems ' + errorListItems);
  //       for (let i = 1; i <= errorListItems; i++) {
  //         const idx: any = i * errorBlockLength - errorBlockLength;
  //         const arr: any = this.rawData.slice(idx, idx + errorBlockLength);
  //         const cartId: any = arr.splice(0, 3);
  //         const secSince17: any = arr.splice(0, 4);
  //         const errorId: any = arr.splice(0, 1);
  //         const userId: any = arr;
  //         result[i-1] = { cartId, secSince17, errorId, userId };
  //       }
  //       for (let j = 0; j < result.length; j++) {
  //         result[j].cartId = (result[j].cartId[0] << 16) | (result[j].cartId[1] << 8) | result[j].cartId[2];
  //         result[j].secSince17 = (result[j].secSince17[0] << 24) | (result[j].secSince17[1] << 16) | (result[j].secSince17[2] << 8) | result[j].secSince17[3];
  //         result[j].errorId = result[j].errorId[0];
  //         result[j].userId = (result[j].userId[0] << 24) | (result[j].userId[1] << 16) | (result[j].userId[2] << 8) | result[j].userId[3];
  //       }
  //       const log: string = (new Date()).toISOString() + ' Success "Error List Data": ' + JSON.stringify(result, null, 2);
  //       this.logData.push(log);
  //       break;
  //     case 'usageList':
  //       const usageBlockLength: number = 11;
  //       const usageListItems: number = Math.ceil(this.rawData.length % usageBlockLength) + 1;
  //       // alert('usageListItems ' + usageListItems);
  //       for (let i = 1; i <= usageListItems; i++) {
  //         const idx: any = i * usageBlockLength - usageBlockLength;
  //         const arr: any = this.rawData.slice(idx, idx + usageBlockLength);
  //         const cartId: any = arr.splice(0, 3);
  //         const usageDays: any = arr.splice(0, 2);
  //         const runTime: any = arr.splice(0, 1);
  //         const numUses: any = arr.splice(0, 1);
  //         const userId: any = arr;
  //         result[i-1] = { cartId, usageDays, runTime, numUses, userId };
  //       }
  //       for (let j = 0; j < result.length; j++) {
  //         result[j].cartId = (result[j].cartId[0] << 16) | (result[j].cartId[1] << 8) | result[j].cartId[2];
  //         result[j].usageDays = (result[j].usageDays[0] << 8) | result[j].usageDays[1];
  //         result[j].runTime = result[j].runTime[0];
  //         result[j].numUses = result[j].numUses[0];
  //         result[j].userId = (result[j].userId[0] << 24) | (result[j].userId[1] << 16) | (result[j].userId[2] << 8) | result[j].userId[3];
  //       }
  //       const log2: string = (new Date()).toISOString() + ' Success "Usage List Data": ' + JSON.stringify(result, null, 2);
  //       this.logData.push(log2);
  //       break;
  //     default:
  //       break;
  //   }
  //   this.decodedData = _.clone(result);
  //   this.successData = JSON.stringify(this.decodedData, null, 2);
  //   // alert('decodeData: ' + JSON.stringify(this.decodedData, null, 2));
  // }

  public goBack() {
    this._ble.disconnect(this.dpDevice, true, true);
    this.openPage(HomeMenu);
  }

  public goNext() {
    // if (this.dependencies.clinic && this.dependencies.newPen) {
    //   let pen = {
    //     clinicId: this.dependencies.clinic.id,
    //     serialNumber: this.dpDevice.id
    //   };
    //   this._pen.registerPen(pen).subscribe(
    //     (resp: any) => {
    //         this.openPage(MyPenComponent);
    //       },
    //     (err: any) => alert(err)
    //   );
    // } else {
    //   alert('Error. No clinic provided for pen!');
    // }
  }

  public doRetry(callback: any) {
    /** Retry steps: 1) disconnect; 2) start connection checker; 3) scan; 4) connect; **/
    /** Disconnect if connection was established **/
    this._ble.disconnect(this.dpDevice, this.disconnected, this.fail);
    /** Start connection checker **/
    this.initConnectionChecker();
    /** Scan for available "Dermapen" BLE device **/
    this._ble.scan(this.dpDevice || {}, (resp: any) => {
      /** Connect to BLE device and invoke provided function **/
      this._ble.connect(this.dpDevice, callback, false);
    }, this._ble.stopScan);
  }
  
  public openPage(page) {
    this.navCtrl.push(page, { dependencies: this.dependencies });
  }

  public scanSuccess(resp: any) {
    this.gettingDevices = false;
    if (resp && resp.dpDevice && resp.dpDevice.id) {
      this.dpDevice = resp.dpDevice;
    }
    this.pairedDevices = resp.pairedDevices && resp.pairedDevices.length ?
      resp.pairedDevices : [];
    this.unpairedDevices = resp.unpairedDevices && resp.unpairedDevices.length ?
      resp.unpairedDevices : [];
    if (resp.dpDevice && resp.dpDevice.id && !resp.dpDevice.paired) {
      this._ble.connect(resp.dpDevice, (done: any) => this.connected(done), this.fail);
    } else if (resp.dpDevice && resp.dpDevice.id && resp.dpDevice.paired) {
      this.isConnected(resp.dpDevice);
    }
  }

  public initConnectionChecker() {
    let jwtCheckInterval: any = setInterval(() => {
      this._ble.isConnected(this.dpDevice, () => {
        clearInterval(jwtCheckInterval);
      }, false);
    }, 1000);
  }

  public isConnected(device: any) {
    this._ble.isConnected(device, (resp: any) => {
      alert('isConnected: ' + JSON.stringify(resp));
    }, this.fail);
  }

  public intToVarints128(value: number) {
    if (value === 0) { return [0]; }
    let varints128: any[] = [];

    let iterValue = value;
    let i = 0;
    while(iterValue !== 0) {
      if (i > 0) {
        varints128[i - 1] = varints128[i -1] | 0x80;
      }

      varints128.push(iterValue & 0x7f);
      iterValue >>= 7;
      ++i;
    }

    return varints128;
  }

  public updateBlackWhiteList() {
    this._pen.getWhitelist().subscribe(
      (resp: any) => {
        alert('getWhitelist: ' + JSON.stringify(resp));
        if (resp && resp.length) {
          this.dummyWhiteBlackList = resp;
        }
      },
      (err: any) => this.fail(err)
    );
  }

  public updateUserInfo() {
    this._account.getAccountInfo().subscribe(
      (resp: any) => {
        this.userInfo = resp;
        this.dummySettings[0] = this.userInfo.accountId;
      },
      (err: any) => this.fail(err)
    );
  }

  private concatTypedArrays(a: any, b: any) { // a, b TypedArray of same type
    let c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }
}
