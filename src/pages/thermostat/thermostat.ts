import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

import { T_INPUT_SELECT_PROPS } from '../../app/types';
import { GroupingComponent } from '../index';
import { GroupingService, HotspotService, UtilService } from '../../services/index';
import {
  TIMEZONES_LIST,
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';

@Component({
  selector: 'thermostat',
  templateUrl: 'thermostat.html'
})
export class ThermostatComponent {

  public loading: boolean = false;
  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;

  public data: any = {
    group: {},
    device: {
      title: '',
      location: ''
    },
    deviceToAttach: '',
    network: {
      ssid: '',
      password: ''
    }
  };
  public activeGroup: any = {};
  public provisioning: string = '';
  public provisionDetails: any = {};
  public step: number = 0;
  public newGroup: any = {};
  public hotspotList: any[] = [];
  public hotspotListZen: any[] = [];
  public unusedDevices: any[] = [];
  public groupCreate: any = {
    formValid: false,
    title: 'Default Create Group title'
  };

  public createGroupInputs: T_INPUT_SELECT_PROPS[] = [
    { modelName: 'title', placeholder: 'Name', type: 'text', required: true },
    { modelName: 'address', placeholder: 'Address', type: 'text', required: false }
  ];

  public provisionInputs: any[] = [
    { modelName: 'title', placeholder: 'Device Name', type: 'text', required: true }
    // { modelName: 'location', placeholder: 'Device Location', type: 'text', required: true }
  ];

  public connectNetworkInputs: any[] = [
    { modelName: 'ssid', placeholder: 'Select Network', type: 'select', required: true, options: [] },
    { modelName: 'password', placeholder: 'Password', type: 'text', required: true },
  ];

  public thermostatBtns: any[] = [
    { title: 'Zen Zigbee', type: 'zenZigbee' },
    { title: 'Zen WIFI', type: 'zenWifi' },
    { title: 'Load Controller', type: 'loadController' }
  ];

  public dependencies: any = {};

  constructor(
    // public menu: MenuController,
    public _grouping: GroupingService,
    public _hotspot: HotspotService,
    public _util: UtilService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    // this.menu.enable(true, 'appMenu');
  }

  public ionViewDidLoad() {
    this.dependencies = this.navParams.get('dependencies') || {};
    if (this.dependencies && this.dependencies.activeGroup && this.dependencies.activeGroup.id) {
      this.activeGroup = this.dependencies.activeGroup;
      this.getParentFor(this.dependencies.activeGroup);
    } else {
      this.dependencies = {};
      this.openPage(GroupingComponent);
      // alert('Error. Group not found!');
    }
  }

  /**
   * Add thermostat action
   * @param {string} type
   */
  public addThermostat(type: string): void {
    console.log('addThermostat type: ', type);
    switch (type) {
      case 'zenZigbee':
        this.provisioning = type;
        this.step = 1;
        this.getUnusedDevices(this.activeGroup.parentId);
        break;
      case 'zenWifi':
        this.provisioning = type;
        // this.scanWifi();
        this.step = 1;
        break;
      case 'loadController':
        this.provisioning = type;
        this.step = 1;
        this.getUnusedDevices(this.activeGroup.parentId);
        break;
      default:
        console.log('addThermostat type is unrecognized:', type);
        break;
    }
  }

  /**
   * Connect thermostat to chosen network
   * @param data
   */
  public connectThermostat(data: any) {
    this.loading = true;
    this._grouping.setConfiguration(data).subscribe(
      (resp: any) => {
        this.loading = false;
        console.log('connectThermostat success resp: ', resp);
        this.step = 5;
      },
      (err: any) => {
        this.loading = false;
        this.showError(err);
      }
    );
  }

  /**
   * Scan WiFi networks
   */
  public scanWifi(type?: string) {
    this.loading = true;
    this._hotspot.scanNetworks(
      (resp: any) => {
        this.loading = false;
        if (type === 'zen') {
          this.hotspotList = [];
          this.hotspotListZen = _.filter(resp, (item: any) => item.SSID.toLowerCase().indexOf('zen') !== -1);
        } else {
          this.hotspotListZen = [];
          this.hotspotList = resp;
          this.connectNetworkInputs[0].options = _.uniqBy(resp.map((item: any) => {
            return {
              value: item.SSID,
              viewValue: item.SSID
            };
          }), 'value');
        }
        console.log('_hotspot.scanNetworks resp: ', JSON.stringify(resp, null, 2));
      },
      (err: any) => {
        this.loading = false;
        console.log('_hotspot.scanNetworks err: ', JSON.stringify(err, null, 2));
      },
    );
  }

  /**
   * Item selected action
   * @param spot
   * @param type
   */
  public itemSelected(spot: any, type?: string) {
    if (type === 'zen') {
      const cred: any = {
        ssid: spot.SSID,
        password: ''
      };
      this.loading = true;
      this._hotspot.connectToWifi(
        cred,
        (done: any) => {
          this.loading = false;
          console.log('connectToWifi done: ', done);
          this.step = 4;
          this.retrieveNetworksAll();
        },
        (err: any) => {
          this.loading = false;
          this.showError(err);
        }
      );
    }
    console.log('itemSelected spot: ', JSON.stringify(spot, null, 2));
  }

  public save(group: any): void {
    console.log('save override group: ', group);
  }

  public provision(data: any) {
    this.loading = true;
    if (data && data.device && data.device.title) {
      this._grouping.provision(data.group.id, data.device).subscribe(
        (resp: any) => {
          this.loading = false;
          if (resp && resp.data && resp.data.sasToken) {
            this.provisionDetails = resp.data;

            this.data.device.deviceId = resp.data.deviceId;
            this.data.device.deviceSecondaryId = resp.data.deviceSecondaryId;
            this.data.device.sasToken = resp.data.sasToken;
            this.data.device.iotHubHostname = resp.data.iotHubHostname;
            this.data.device.iotHubPort = '8883';

            this.step = 2;

            this.retrieveNetworksZen();
          } else {
            alert('Error, sasToken not found in response: ' + JSON.stringify(resp, null, 2));
          }
        },
        (err: any) => {
          this.loading = false;
          this.showError(err);
        }
      );
    }
  }

  /**
   * Get parent group for group
   * @param group
   */
  public getParentFor(group: any) {
    this.loading = true;
    this._grouping.getGroup(group.parentId).subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp && resp.data) {
          this.data.group = resp.data;
        }
      },
      (err: any) => {
        this.loading = false;
        this.showError(err);
      }
    );
  }

  public attachDevice(mac: any) {
    const device: any = _.find(this.dependencies.unusedDevicesFull, { hubMacAddress: mac });
    console.log('attachDevice device: ', device);
    this.loading = true;
    this._grouping.assignDeviceToGroup(this.activeGroup.id, device).subscribe(
      (resp: any) => {
        this.loading = false;
        this.step = 5;
      },
      (err: any) => {
        this.loading = false;
        this.showError(err);
      }
    );
  }

  public getUnusedDevices(id: string) {
    this.loading = true;
    this._grouping.getUnusedDevices(id).subscribe(
      (resp: any) => {
        this.loading = false;
        let deviceType: string = '';
        switch (this.provisioning) {
          case 'zenZigbee':
            deviceType = 'zengine';
            break;
          case 'loadController':
            deviceType = 'securifi';
            break;
          default:
            break;
        }
        const unusedDevices: any[] = _.filter(resp.data, (d: any) => d.cloud === deviceType).map((item: any) => {
          return {
            value: item.hubMacAddress,
            viewValue: item.title
          };
        });
        this.dependencies.unusedDevicesFull = resp.data;
        this.unusedDevices = _.uniqBy([...unusedDevices], 'value');
      },
      (err: any) => {
        this.loading = false;
        alert(JSON.stringify(err, null, 2));
      }
    )
  }

  public retrieveNetworksZen() {
    this.step = 2;
    this.scanWifi('zen');

    let scanWifiInterval: any = setInterval(() => {
      if (this.step === 2) {
        this.scanWifi('zen');
      } else {
        clearInterval(scanWifiInterval);
      }
    }, 5000);
  }

  public retrieveNetworksAll() {
    this.scanWifi();
  }

  public goToGroup(group: any) {
    this.dependencies.activeGroup = _.clone(group);
    this.dependencies.edit = false;
    this.openPage(GroupingComponent);
  }

  public openPage(page: any) {
    this.navCtrl.push(page, { dependencies: this.dependencies });
  }

  public prepareGroupCreation(group: any) {
    this.activeGroup = _.clone(group);
    const titleAction: string = this.dependencies.edit ? 'Edit' : 'Create';
    switch (this.activeGroup.level - (this.dependencies.edit ? 1 : 0)) {
      case 0:
        this.groupCreate.title = `${titleAction} Organization`;
        this.createGroupInputs = [
          { modelName: 'title', placeholder: 'Organization Name', type: 'text', required: true }
        ];
        break;
      case 1:
        this.groupCreate.title = `${titleAction} Region`;
        this.createGroupInputs = [
          { modelName: 'title', placeholder: 'Region Name', type: 'text', required: true }
        ];
        break;
      case 2:
        this.groupCreate.title = `${titleAction} Site`;
        this.createGroupInputs = [
          { modelName: 'title', placeholder: 'Site Name', type: 'text', required: true },
          { modelName: 'address', placeholder: 'Site Address', type: 'google-autocomplete', required: true },
          { modelName: 'utcOffset', placeholder: 'Site Timezone', type: 'select', required: true, options: TIMEZONES_LIST }
        ];
        break;
      case 3:
        this.groupCreate.title = `${titleAction} Group`;
        this.createGroupInputs = [
          { modelName: 'title', placeholder: 'Group Name', type: 'text', required: true }
        ];
        break;
      default:
        this.groupCreate.title = `${titleAction} Group`;
        this.createGroupInputs = [];
        break;
    }
    this.newGroup.parentId = this.activeGroup.id;
    if (this.dependencies.edit) {
      this.newGroup = _.clone(group);
      if (this.newGroup && this.newGroup.location) {
        this.newGroup.address = this.newGroup.location.address;
      }
    }
  }

  public applyAddressTo(group: any, prediction: any) {
    if (prediction && prediction.formatted_address) {
      group.location = {};
      group.location.address = prediction.formatted_address;
      group.location.utc_offset = parseInt(prediction.utc_offset, 10);
      group.utcOffset = parseInt(prediction.utc_offset, 10);
      prediction.address_components.forEach((el: any) => {
        switch (el.types[0]) {
          case 'country':
            group.location.country = el.long_name;
            break;
          case 'administrative_area_level_1':
            group.location.state = el.long_name;
            break;
          case 'locality':
            group.location.city = el.short_name;
            break;
          case 'postal_code':
            group.location.zip = el.long_name;
            break;
          default:
            break;
        }
      });
      if (prediction.geometry && prediction.geometry.location && prediction.geometry.location.lat) {
        group.location.lat = prediction.geometry.location.lat;
        group.location.lng = prediction.geometry.location.lng;
      }
    }
    this.onChangeValidate();
  }

  public createGroup(item: any) {
    console.log('createGroup item: ', item);
  }

  public addAnother() {
    this.provisioning = '';
    this.step = 0;
    this.hotspotList = [];
    this.hotspotListZen = [];
    this.data = {
      group: {},
      device: {
        title: '',
        location: ''
      },
      deviceToAttach: '',
      network: {
        ssid: '',
        password: ''
      }
    };
    this.getParentFor(this.dependencies.activeGroup);
  }

  // public requestRemove(item: any) {
  //   const options: any = {
  //     title: 'Confirm',
  //     message: `Do you really want to remove Clinic ${item.name}, ${item.address}?`
  //   };
  //   this.showConfirm(options, 'delete', item);
  // }

  public showError(err: any) {
    if (err && err.status === 503) {
      const dialogOptions: any = {
        title: 'Error!',
        message: 'Connection issue discovered. Please try again.'
      };
      this.showConfirm(dialogOptions);
    } else {
      alert(JSON.stringify(err, null, 2));
    }
  };

  public showConfirm(options: any, action?: string, item?: any) {
    let btnNo: any = {
      text: 'No',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    };
    let btnYes: any = {
      text: 'Yes',
      handler: () => {
        this.doConfirmed(action, item);
      }
    };
    let btnOk: any = {
      text: 'Ok'
    };
    let buttons: any[] = options && options.type && options.type === 'confirm' ? [ btnNo, btnYes ] : [ btnOk ];
    let alert: any = this.alertCtrl.create({
      title: options.title,
      message: options.message,
      buttons
    });
    alert.present();
  }

  public doConfirmed(action: string, item?: any) {
    switch (action) {
      case 'delete':
        console.log('doConfirmed action: ', action);
        break;
      default:
        console.log('doConfirmed action: ', action);
        break;
    }
  }

  /**
   * Validate form
   */
  public onChangeValidate() {
    let isValid = true;
    if (this.activeGroup.level - (this.dependencies.edit ? 1 : 0) === 2) {
      isValid = this.newGroup
        && this.newGroup.location
        && this.newGroup.location.address
        && this.newGroup.location.lat
        && this.newGroup.location.lng
        && typeof this.newGroup.utcOffset === 'number';
    }
    _.forEach(this.createGroupInputs, (item: any) => {
      let err = this._util.validateItem(item, this.newGroup[item.modelName]);
      if (err) {
        isValid = false;
      }
      // } else if (item.required) {
      //   if ((!this.newGroup[item.modelName] ||
      //     !this.newGroup[item.modelName].length ||
      //     this.newGroup[item.modelName].length < 2)) {
      //     isValid = false;
      //   }
      // }
    });
    this.groupCreate.formValid = isValid;
  }

}
