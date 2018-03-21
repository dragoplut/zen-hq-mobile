import { Component } from '@angular/core';
import {AlertController, MenuController, NavController, NavParams} from 'ionic-angular';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

import { GroupCreateComponent, OverrideComponent, ThermostatComponent } from '../index';
import { GroupingService } from '../../services/index';
import {
  MODE_IMG_CHUNK,
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';

@Component({
  selector: 'grouping',
  templateUrl: 'grouping.html'
})
export class GroupingComponent {

  public loading: boolean = false;
  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public modeImgChunk: string = MODE_IMG_CHUNK;

  public searchInput: string = '';

  public activeGroup: any = {};
  public groupList: any[] = [];
  public groupListFiltered: any[] = [];
  public groupDevicesList: any[] = [];
  public groupDevicesListFiltered: any[] = [];
  public showList: any = {
    groups: true,
    devices: false
  };

  public dependencies: any = {};

  constructor(
    public menu: MenuController,
    public _grouping: GroupingService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.groupListFiltered = this.searchByString(this.searchInput, this.groupList);
    this.menu.enable(true, 'appMenu');
  }

  public ionViewDidLoad() {
    this.dependencies = this.navParams.get('dependencies') || {};
    if (this.dependencies && this.dependencies.activeGroup && this.dependencies.activeGroup.id) {
      this.activeGroup = _.clone(this.dependencies.activeGroup);
      this.getGroup(this.dependencies.activeGroup.id);
    } else {
      this.getGroup();
    }
  }

  public onInput(event) {
    if (event.target.value) {
      if (this.showList.groups) {
        this.groupListFiltered = this.searchByString(event.target.value,this.groupList);
      } else {
        this.groupDevicesListFiltered = this.searchByString(event.target.value, this.groupDevicesList);
      }
    } else {
      this.getGroup(this.activeGroup.id);
    }
  }

  public onCancel() {
    this.searchInput = '';
    this.getGroup(this.activeGroup.id);
  }

  public itemSelected(group: any) {
    this.getGroup(group.id);
    // if (this.dependencies.newPen) {
    //   this.dependencies.clinic = clinic;
    //   this.openPage(RegisterPenComponent);
    // } else {
    //   this.navCtrl.push(EditClinicComponent, { clinic })
    // }
  }

  public groupCreateFor(group: any) {
    console.log('groupCreateFor group: ', group);
    this.dependencies.activeGroup = _.clone(group);
    if (group.level < 4) {
      this.openPage(GroupCreateComponent);
    } else {
      this.openPage(ThermostatComponent);
    }
  }

  public groupEdit(group: any) {
    console.log('groupEdit group: ', group);
    this.dependencies.activeGroup = _.clone(group);
    this.dependencies.edit = true;
    this.openPage(GroupCreateComponent);
  }

  public override(group: any) {
    console.log('override group: ', group);
    this.dependencies.activeGroup = _.clone(group);
    this.openPage(OverrideComponent);
  }

  public openPage(page: any) {
    this.navCtrl.push(page, { dependencies: this.dependencies });
  }

  public getGroup(id?: string) {
    this.loading = true;
    this.dependencies.edit = false;
    this._grouping.getGroup(id).subscribe(
      (resp: any) => {
        this.loading = false;
        console.log('resp: ', resp);
        this.activeGroup = resp.data;
        this.dependencies.activeGroup = _.clone(resp.data);
        if (this.activeGroup.level < 4) {
          this.getGroupChildren(this.activeGroup);
        } else {
          console.log('getDevices this.activeGroup: ', this.activeGroup);
          this.getDevices(this.activeGroup.id);
        }
      },
      (err: any) => {
        this.loading = false;
        console.log('err: ', err);
      }
    );
  }

  public getDevices(id?: string) {
    this.loading = true;
    this.showList.groups = false;
    this.showList.devices = true;
    console.log('getDevices id', id);
    this._grouping.getGroupDevices(id).subscribe(
      (resp: any) => {
        this.loading = false;
        console.log('resp: ', resp);
        // this.activeGroup = resp.data;
        this.groupDevicesList = resp.data;
        this.groupDevicesListFiltered = this.searchByString(this.searchInput, this.groupDevicesList);
      },
      (err: any) => {
        this.loading = false;
        console.log('err: ', err);
      }
    );
  }

  public getGroupChildren(group?: any) {
    this.loading = true;
    this.showList.groups = true;
    this.showList.devices = false;
    this.groupDevicesList = [];
    this.groupDevicesListFiltered = [];
    this._grouping.getGroupChildren(group ? group.id : '').subscribe(
      (resp: any) => {
        this.loading = false;
        console.log('resp: ', resp);
        this.groupList = resp.data;
        this.groupListFiltered = this.searchByString(this.searchInput, this.groupList);
      },
      (err: any) => {
        this.loading = false;
        console.log('err: ', err);
      }
    );
  }

  public getPrevGroup(group: any) {
    this.getGroup(group.parentId);
  }

  public removeItem(item: any) {
    // this._grouping.deleteClinic(item.id).subscribe(
    //   (resp: any) => {
    //     this.getGroup();
    //   },
    //   (err: any) => {
    //     alert(JSON.stringify(err));
    //   }
    // );
  }

  public getGroupsSearch(searchValue: string) {
    this._grouping.getGroupsSearch(searchValue).subscribe(
      (resp: any) => {
        console.log('resp: ', resp);
        this.groupListFiltered = resp;
      },
      (err: any) => {
        console.log('err: ', err);
      }
    );
  }

  /** Search function **/
  public searchByString(searchVal: string, itemsList: any[]) {
    if (searchVal && searchVal.length && typeof searchVal === 'string') {
      /** Transform search string toLowerCase for next search **/
      searchVal = searchVal.toLowerCase();
      /** Found users will be stored here **/
      let filtered = [];
      /** Define prop names to search in **/
      const propsToSearch = [
        'title'
      ];
      /** Loop our itemsList **/
      itemsList.forEach((item: any) => {
        /** Clone user to get rid of possible mutations **/
        let user = JSON.parse(JSON.stringify(item));
        /** Loop in allowed props to search **/
        for (let propName of propsToSearch) {
          /** Check if value exist and if it includes searchVal **/
          if (user[propName] && user[propName].toLowerCase().indexOf(searchVal) !== -1) {
            /** Found match push to filtered array and exit from current loop **/
            filtered.push(item);
            break;
          }
        }
      });
      /** Return filtered itemsList **/
      return filtered;
    } else {
      /** Return empty result if searchVal is empty or not a string **/
      return itemsList;
    }
  }

  public requestRemove(item: any) {
    const options: any = {
      title: 'Confirm',
      message: `Do you really want to remove Clinic ${item.name}, ${item.address}?`
    };
    this.showConfirm(options, 'delete', item);
  }

  public showConfirm(options: any, action: string, item?: any) {
    let alert: any = this.alertCtrl.create({
      title: options.title,
      message: options.message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.doConfirmed(action, item);
          }
        }
      ]
    });
    alert.present();
  }

  public doConfirmed(action: string, item?: any) {
    switch (action) {
      case 'delete':
        this.removeItem(item);
        break;
      default:
        break;
    }
  }
}
