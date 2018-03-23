import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

import { GroupingComponent } from '../index';
import { GroupingService, HotspotService, UtilService } from '../../services/index';
import {
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';

@Component({
  selector: 'hub',
  templateUrl: 'hub.html'
})
export class HubComponent {

  public loading: boolean = false;
  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;

  public data: any = {
    group: {},
    device: {
      title: '',
      location: ''
    },
    hubMac: '',
    network: {
      ssid: '',
      password: ''
    }
  };
  public activeGroup: any = {};
  public attachHubType: string = '';
  public step: number = 0;
  public newGroup: any = {};
  public hubsList: any[] = [];
  public hubsListFull: any[] = [];
  public hotspotList: any[] = [];
  public hotspotListZen: any[] = [];
  public groupCreate: any = {
    formValid: false,
    title: 'Default Create Group title'
  };

  public rainforestInputs: any[] = [
    { modelName: 'title', placeholder: 'Hub Name', type: 'text', required: true },
    { modelName: 'serial', placeholder: 'Hub Serial', type: 'text', required: true }
  ];

  public hubBtns: any[] = [
    { title: 'Rainforest', type: 'rainforest' },
    { title: 'Securifi', type: 'securifi' }
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
      this.updateUnusedDevicesList();
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
  public addHub(type: string): void {
    console.log('addHub type: ', type);
    switch (type) {
      case 'rainforest':
        this.attachHubType = type;
        break;
      case 'securifi':
        this.attachHubType = type;
        this.step = 1;
        break;
      case 'loadController':
        break;
      default:
        console.log('addHub type is unrecognized:', type);
        break;
    }
  }

  /**
   * Connect thermostat to chosen network
   * @param data
   */
  public connectHub(data: any) {
    this.loading = true;
    this._grouping.setConfiguration(data).subscribe(
      (resp: any) => {
        this.loading = false;
        console.log('connectHub success resp: ', resp);
        this.step = 5;
      },
      (err: any) => {
        this.loading = false;
        this.showError(err);
      }
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

  public attachHub(mac: any) {
    console.log('attachHub mac: ', mac);
    this.loading = true;
    if (mac && this.activeGroup && this.activeGroup.id) {
      let group: any = this.activeGroup;
      group.hubs.push(mac);
      group = _.pick(group, [ 'id', 'hubs', 'title' ]);
      this._grouping.updateGroup(group).subscribe(
        (resp: any) => {
          this.loading = false;
          this.step = 2;
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

  /**
   * Get parent group for group
   * @param group
   */
  public requestActiveGroup(group: any) {
    this.loading = true;
    this._grouping.getGroup(group.id).subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp && resp.data) {
          this.activeGroup = resp.data;
          this.dependencies.activeGroup = resp.data;
          this.updateUnusedDevicesList();
        }
      },
      (err: any) => {
        this.loading = false;
        this.showError(err);
      }
    );
  }

  public updateUnusedDevicesList() {
    this.hubsListFull = this.dependencies.unusedDevicesFull || [];
    if (this.hubsListFull && this.hubsListFull.length) {
      this.hubsList = _.filter(_.uniqBy(this.hubsListFull.map((item: any) => {
        return {
          value: item.hubMacAddress,
          valueOriginal: item,
          viewValue: item.hub
        };
      }), 'viewValue'), (item: any) => this.activeGroup.hubs.indexOf(item.value) === -1);
    }
  }

  public goToGroup(group: any) {
    this.dependencies.activeGroup = _.clone(group);
    this.dependencies.edit = false;
    this.openPage(GroupingComponent);
  }

  public openPage(page: any) {
    this.navCtrl.push(page, { dependencies: this.dependencies });
  }

  public addAnother() {
    this.attachHubType = '';
    this.step = 0;
    this.hotspotList = [];
    this.hotspotListZen = [];
    this.data = {
      group: {},
      device: {
        title: '',
        location: ''
      },
      hubMac: '',
      network: {
        ssid: '',
        password: ''
      }
    };
    this.requestActiveGroup(this.dependencies.activeGroup);
    this.getParentFor(this.dependencies.activeGroup);
  }

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
    // _.forEach(this.createGroupInputs, (item: any) => {
    //   let err = this._util.validateItem(item, this.newGroup[item.modelName]);
    //   if (err) {
    //     isValid = false;
    //   }
    // });
    this.groupCreate.formValid = isValid;
  }

}
