import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

import { T_INPUT_SELECT_PROPS } from '../../app/types';
import { GroupingComponent, HubComponent } from '../index';
import { GroupingService, UtilService } from '../../services/index';
import {
  TIMEZONES_LIST,
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';

@Component({
  selector: 'group-create',
  templateUrl: 'group-create.html'
})
export class GroupCreateComponent {

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public loading: boolean = false;

  public activeGroup: any = {};
  public newGroup: any = {
    hubs: []
  };
  public unusedDevices: any[] = [];
  public groupCreate: any = {
    formValid: false,
    title: 'Default Create Group title'
  };

  public createGroupInputs: T_INPUT_SELECT_PROPS[] = [
    { modelName: 'title', placeholder: 'Name', type: 'text', required: true },
    { modelName: 'address', placeholder: 'Address', type: 'text', required: false }
  ];

  public dependencies: any = {};

  constructor(
    // public menu: MenuController,
    public _grouping: GroupingService,
    public _util: UtilService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    // this.menu.enable(true, 'appMenu');
  }

  public ionViewDidLoad() {
    this.dependencies = this.navParams.get('dependencies') || {};
    console.log('group-create ionViewDidLoad this.dependencies: ', this.dependencies);
    if (this.dependencies && this.dependencies.activeGroup && this.dependencies.activeGroup.id) {
      this.activeGroup = this.dependencies.activeGroup;
      if (this.activeGroup.level <= 4) {
        this.getUnusedDevices(
          this.dependencies.edit ? this.activeGroup.parentId : this.activeGroup.id,
          (resp: any) => {
            this.prepareGroupCreation(this.dependencies.activeGroup);
          },
          (err: any) => {
            console.log(JSON.stringify(err, null, 2))
          }
        );
      }
      // if (this.dependencies.edit) {
      //   this.prepareGroupCreation(this.dependencies.activeGroup);
      // } else {
      //   // this.prepareGroupCreation(this.dependencies.activeGroup);
      // }
    } else {
      this.dependencies = {};
      this.openPage(GroupingComponent);
      alert('Error. Group not found!');
    }
  }

  public save(group: any): void {
    if (this.dependencies.edit) {

      console.log('update group: ', group);
      this._grouping.updateGroup(group).subscribe(
        (resp: any) => {
          console.log('resp: ', resp);
          // this.activeGroup = resp.data;
          this.goToGrouping(this.activeGroup);
        },
        (err: any) => {
          console.log('err: ', err);
        }
      );
    } else {
      console.log('create group: ', group);
      this._grouping.createGroup(group).subscribe(
        (resp: any) => {
          console.log('resp: ', resp);
          // this.activeGroup = resp.data;
          this.goToGrouping(this.activeGroup);
        },
        (err: any) => {
          console.log('err: ', err);
        }
      );
    }
  }

  public getUnusedDevices(id: string, callback?: any, reject?: any) {
    this.loading = true;
    this._grouping.getUnusedDevices(id).subscribe(
      (resp: any) => {
        console.log('getUnusedDevices resp: ', resp, ' this.newGroup.hubs: ', this.newGroup.hubs);
        this.loading = false;
        const unusedDevices: any[] = JSON.parse(JSON.stringify(resp.data.map((item: any) => {
          return {
            value: item.hubMacAddress,
            viewValue: item.hubMacAddress
          };
        })));
        const usedDevices: any[] = this.newGroup.hubs.map((item: any) => {
          return {
            value: item,
            viewValue: item
          };
        });
        this.dependencies.unusedDevicesFull = resp.data;
        this.unusedDevices = _.uniqBy([...unusedDevices, ...usedDevices], 'value');
        if (callback) {
          callback(resp);
        }
      },
      (err: any) => {
        this.loading = false;
        if (reject) {
          reject(err);
        }
        alert(JSON.stringify(err, null, 2));
      }
    )
  }

  public goToGrouping(group: any) {
    this.dependencies.activeGroup = _.clone(group);
    this.openPage(GroupingComponent);
  }

  public goToHub(group: any) {
    this.dependencies.activeGroup = _.clone(group);
    this.openPage(HubComponent);
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
      this.newGroup = JSON.parse(JSON.stringify(group));
      if (this.newGroup && this.newGroup.location) {
        this.newGroup.address = this.newGroup.location.address;
      }
    }
    console.log('this.createGroupInputs: ', this.createGroupInputs);
  }

  public applyAddressTo(group: any, prediction: any) {
    console.log('applyAddressTo group: ', group, ' prediction: ', prediction);
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
    console.log('applyAddressTo DONE: ', this.newGroup);
    this.onChangeValidate();
  }

  public createGroup(item: any) {
    console.log('createGroup item: ', item);
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
      console.log('err: ', err);
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
    console.log('onChangeValidate isValid: ', isValid, ' this.newGroup: ', this.newGroup);
  }

  public selectedMultiple(event: any) {
    console.log('selectedMultiple: ', event);
  }
}
