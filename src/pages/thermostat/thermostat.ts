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

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;

  public data: any = {
    group: {},
    device: {
      title: '',
      location: ''
    },
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
    if (_.hasIn(this.dependencies, 'activeGroup.id')) {
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
        break;
      case 'zenWifi':
        this.provisioning = type;
        // this.scanWifi();
        this.step = 1;
        break;
      case 'loadController':
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
    this._grouping.setConfiguration(data).subscribe(
      (resp: any) => {
        console.log('connectThermostat success resp: ', resp);
        this.step = 5;
      },
      (err: any) => {
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  /**
   * Scan WiFi networks
   */
  public scanWifi(type?: string) {
    this._hotspot.scanNetworks(
      (resp: any) => {
        if (type === 'zen') {
          this.hotspotList = [];
          this.hotspotListZen = _.filter(resp, (item: any) => item.SSID.toLowerCase().indexOf('zen') !== -1);
        } else {
          this.hotspotListZen = [];
          this.hotspotList = resp;
          this.connectNetworkInputs[0].options = resp.map((item: any) => {
            return {
              value: item.SSID,
              viewValue: item.SSID
            };
          });
        }
        console.log('_hotspot.scanNetworks resp: ', JSON.stringify(resp, null, 2));
      },
      (err: any) => {
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
      this._hotspot.connectToWifi(
        cred,
        (done: any) => {
          console.log('connectToWifi done: ', done);
          this.step = 4;
          this.retrieveNetworksAll();
        },
        (err: any) => {
          alert(JSON.stringify(err, null, 2))
        }
      );
    }
    console.log('itemSelected spot: ', JSON.stringify(spot, null, 2));
  }

  public save(group: any): void {
    console.log('save override group: ', group);
  }

  public provision(data: any) {
    if (data && data.device && data.device.title) {
      this._grouping.provision(data.group.id, data.device).subscribe(
        (resp: any) => {
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
          alert(JSON.stringify(err, null, 2));
        }
      );
    }
  }

  /**
   * Get parent group for group
   * @param group
   */
  public getParentFor(group: any) {
    this._grouping.getGroup(group.parentId).subscribe(
      (resp: any) => {
        if (resp && resp.data) {
          this.data.group = resp.data;
        }
      },
      (err: any) => {
        alert(JSON.stringify(err, null, 2));
      }
    );
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

    let scanWifiInterval: any = setInterval(() => {
      if (this.step === 4) {
        this.scanWifi();
      } else {
        clearInterval(scanWifiInterval);
      }
    }, 5000);
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

  // public showConfirm(options: any, action: string, item?: any) {
  //   let alert: any = this.alertCtrl.create({
  //     title: options.title,
  //     message: options.message,
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.doConfirmed(action, item);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // public doConfirmed(action: string, item?: any) {
  //   switch (action) {
  //     case 'delete':
  //       // this.removeItem(item);
  //       break;
  //     default:
  //       break;
  //   }
  // }

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
