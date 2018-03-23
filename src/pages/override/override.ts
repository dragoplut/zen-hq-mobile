import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { WheelSelector } from '@ionic-native/wheel-selector';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

import { GroupingComponent } from '../index';
import { GroupingService, UtilService } from '../../services/';
import { MODE_IMG_CHUNK } from "../../app/constants";

@Component({
  selector: 'override',
  templateUrl: 'override.html'
})
export class OverrideComponent {

  public modeImgChunk: string = MODE_IMG_CHUNK;

  public activeGroup: any = {};
  public dependencies: any = {};
  public events: any = [];
  public loading: boolean = false;
  public event: any = {
    created: false,
    durationType: 'time',
    duration: '1',
    mode: 'cool',
    setpoint: 72,
    type: 'temporary-override'
  };
  public options: any = {
    action: {
      down: true,
      up: true
    },
    durations: [],
    durationTypeSelector: [
      { value: 'time', viewValue: 'Time' },
      { value: 'until', viewValue: 'Until' }
    ],
    selectorItems: [
      'duration',
      'setpoint'
    ],
    setpoints: [],
    duration: {
      max: 24,
      min: 1
    },
    setpoint: {
      max: 99,
      min: 40
    }
  };

  public timeDurationSelects: any[] = [
    { modelName: 'duration', placeholder: 'Duration (hours)', type: 'select', multiSelect: false, required: false, options: this.options.durations },
    { modelName: 'durationType', placeholder: 'Duration Type', type: 'select', multiSelect: false, required: false, options: this.options.durationTypeSelector }
  ];

  constructor(
    public _util: UtilService,
    public _grouping: GroupingService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public selector: WheelSelector
  ) { }

  public ionViewDidLoad() {
    this.dependencies = this.navParams.get('dependencies') || {};
    if (this.dependencies && this.dependencies.activeGroup && this.dependencies.activeGroup.id) {
      this.generateSelectorItems();
      this.activeGroup = this.dependencies.activeGroup;
      this.timeDurationSelects = [
        { modelName: 'duration', placeholder: 'Duration (hours)', type: 'select', required: false, options: this.options.durations },
        { modelName: 'durationType', placeholder: 'Duration Type', type: 'select', required: false, options: this.options.durationTypeSelector }
      ];
      this.getGroupEvents(this.activeGroup.id);
      console.log('ionViewDidLoad this.dependencies: ', this.dependencies);
    } else {
      this.dependencies = {};
      this.openPage(GroupingComponent);
      alert('Error. Group not found!');
    }
  }

  public setpointCalculated(value: number) {
    return value;
  }

  public changeSetpoint(direction: string) {
    switch (direction) {
      case 'down':
        if (this.event.setpoint > this.options.setpoint.min) {
          this.event.setpoint--;
        }
        break;
      case 'up':
        if (this.event.setpoint < this.options.setpoint.max) {
          this.event.setpoint++;
        }
        break;
      default:
        break;
    }
    this.options.action.down = this.event.setpoint > this.options.setpoint.min;
    this.options.action.up = this.event.setpoint < this.options.setpoint.max;
  }

  public save(data: any) {
    console.log('save temporary-override event: ', data);
    this.loading = true;
    const activeTimezone: number = this.activeGroup.utcOffset * 60 * 1000;
    this.activeGroup.events = this.events;
    let event: any = this._util.viewEventToEvent(data, this.activeGroup, activeTimezone);
    event.mode = this.toFirstUpper(event.mode);
    console.log('activeTimezone: ', activeTimezone);
    console.log('event: ', event);
    this._grouping.createEvent(event, this.activeGroup.id).subscribe(
      (resp: any) => {
        this.loading = false;
        this.event.created = true;
        console.log('resp: ', resp);
      },
      (err: any) => {
        this.loading = false;
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  public getGroupEvents(id: string) {
    this.loading = true;
    this._grouping.getGroupEvents(id).subscribe(
      (resp: any) => {
        this.loading = false;
        this.events = resp.data;
      },
      (err: any) => {
        this.loading = false;
        alert(JSON.stringify(err, null, 2));
      }
    );
  }

  public goToGrouping(group: any) {
    this.dependencies.activeGroup = _.clone(group);
    this.openPage(GroupingComponent);
  }

  public openPage(page: any) {
    this.navCtrl.push(page, { dependencies: this.dependencies });
  }

  public showWeelSelector(name: string) {
    this.platform.ready().then(() => {
      if (this.options[name + 'Selector']) {
        this.selector.show(this.options[name + 'Selector']).then(
          (result: any) => {
            if (result && result.length) {
              this.event[name] = result[0].value;
            }
            console.log('showWeelSelector result: ', result);
            console.log('showWeelSelector this.event: ', this.event);
          },
          (err: any) => {
            console.log('showWeelSelector err: ', err);
          }
        )
      }
    });
  }

  public generateSelectorItems() {
    for (let item of this.options.selectorItems) {
      if (this.options && this.options[item]) {
        this.options[item + 's'] = [];
        for (let o = this.options[item].min; o <= this.options[item].max; o++) {
          let option: any = { value: '' + o, viewValue: typeof o === 'string' ? this.toFirstUpper(o) : '' + o };
          this.options[item + 's'].push(option);
        }
        this.options[item + 'Selector'] = {
          title: this.toFirstUpper(item),
          items: this.options[item + 's'],
          displayKey: 'value',
          defaultItems: this.options[item + 's'][Math.ceil(this.options[item + 's'].length / 2)]
        };
      }
    }
    console.log('generateSelectorItems this.options: ', this.options);
  }

  public toFirstUpper(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
