import { Injectable } from '@angular/core';
import { ApiService } from '../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';
import * as moment from 'moment';

import { EMAIL_REGEXP, EVENT_TYPE, WEEKDAYS, TEMPERATURE_UNIT } from '../../app/constants';
import { T_LOCATION_PARAMS, T_INPUT_SELECT_PROPS } from '../../app/types';

@Injectable()
export class UtilService {
  public path: string = '/Location';

  constructor(private api: ApiService) {}

  public getLocation(params: T_LOCATION_PARAMS): Observable<any> {
    return this.api.post(`${this.path}/getLocations`, params)
      .map((resp: any) => {
        /** TODO: change "counties" to "countries" after API fix typo **/
        if (resp && resp.counties && resp.counties.length) {
          let countries: any[] = _.clone(resp.counties);
          /** Move "top used" countries to top for better UX **/
          const au: any = _.find(countries, { name: 'Australia' });
          const ca: any = _.find(countries, { name: 'Canada' });
          const us: any = _.find(countries, { name: 'United States' });
          const topCountries: any[] = [ au, ca, us ];

          countries.splice(countries.indexOf(au), 1);
          countries.splice(countries.indexOf(ca), 1);
          countries.splice(countries.indexOf(us), 1);

          resp.counties = topCountries.concat(countries);
        }
        return resp;
      });
  }

  /**
   * Validate
   * @param {T_INPUT_SELECT_PROPS} field
   * @param value
   * @returns {string}
   */
  public validateItem(field: T_INPUT_SELECT_PROPS, value: any) {
    let errMessage: string = '';

    switch (field.type) {
      case 'email':
        errMessage = !EMAIL_REGEXP.test(value) && value ?
          'Email is invalid' : '';
        break;
      case 'text':
      case 'google-autocomplete':
        if (typeof value === 'string') {
          if (value && value.length < 1) {
            errMessage = `${field.placeholder} min length 1 character!`;
          }
          if (value && value.length > 50) {
            errMessage = `${field.placeholder} max length 50 characters!`;
          }
          if (!value) {
            errMessage = `${field.placeholder} max length 50 characters!`;
          }
        }
        break;
      case 'select':
        if (typeof value === 'number' && (value !== 0 && !value)) {
          errMessage = `${field.placeholder} field is required!`;
        }
        if (typeof value === 'string' && !value) {
          errMessage = `${field.placeholder} field is required!`;
        }
        break;
      default:
        break;
    }

    return errMessage;
  }

  /**
   * Convert celsius to fahrenheit
   * @param c
   * @param precision
   * @returns {any}
   */
  public toFahrenheit(c: any, precision?: any) {
    precision = precision || 0;

    if (isNaN(c)) return c;

    let decimalResult = c * 1.8 + 32;

    return parseFloat(decimalResult.toFixed(precision));
  };

  /**
   * Convert fahrenheit to celsius
   * @param f
   * @returns {any}
   */
  public toCelsius(f: any) {
    if (isNaN(f)) return f;

    let decimalResult: any = (f - 32) / 1.8;
    let int: number = parseInt(decimalResult);
    let remainder: number = Math.abs(decimalResult - parseInt(decimalResult));

    if (remainder >= 0 && remainder < 0.25) {
      return int;
    } else if (remainder >= 0.25 && remainder < 0.75) {
      return (int >= 0) ? int + 0.5 : int - 0.5;
    } else {
      return (int >= 0) ? int + 1 : int - 1;
    }
  };

  public getCurrentDayOfWeek(timezone) {
    let day = moment
      .utc()
      .add(timezone, "ms")
      .day();

    return WEEKDAYS[day - 1];
  }

  public getEndTimeForTemporaryOverrideEvent(event, events, activeTimezone) {
    let day = this.getCurrentDayOfWeek(activeTimezone);

    let currentEvent = null;
    for (let i = 0; i < events.length; i++) {
      let holidayWeekDay = events[i].type === EVENT_TYPE.HOLIDAY ?
        this.getCurrentDayOfWeekFromDate(events[i].eventDate) : '';
      if ((events[i].type !== EVENT_TYPE.TEMPORARY_OVERRIDE &&
          _.includes(events[i].days, day)) ||
        holidayWeekDay === day) {

        if (event.start > events[i].start && event.start < events[i].end) {
          currentEvent = events[i];
          break;
        }
      }
    }

    if (currentEvent !== null) {
      console.log('currentEvent', currentEvent);
      return currentEvent.end;
    }

    let nextEvent = null;
    for (let i = 0; i < events.length; i++) {
      let holidayWeekDay = events[i].type === EVENT_TYPE.HOLIDAY ?
        this.getCurrentDayOfWeekFromDate(events[i].eventDate) : '';
      if ((events[i].type !== EVENT_TYPE.TEMPORARY_OVERRIDE &&
          _.includes(events[i].days, day)) ||
        holidayWeekDay === day) {

        if (event.start < events[i].start) {
          if (nextEvent === null || events[i].start < nextEvent.start) {
            nextEvent = events[i];
          }
        }
      }
    }
  }

  public getCurrentDayOfWeekFromDate(date) {
    let day = moment
      .utc(date)
      .day();

    return WEEKDAYS[day - 1];
  }

  public viewEventToEvent(viewEvent: any, group: any, activeTimezone: number) {

    let temperatureUnit: string = TEMPERATURE_UNIT.F;

    let event: any = {
      groupId: group.id,
      type: viewEvent.type,
      mode: viewEvent.mode,
      setpoint: (temperatureUnit === TEMPERATURE_UNIT.C) ?
        this.toFahrenheit(parseFloat(viewEvent.setpoint)) : parseInt(viewEvent.setpoint, 10),
      durationType: viewEvent.durationType
    };

    if (!event.id) {
      let startOfDayWithOffset = moment
        .utc()
        .add(activeTimezone, "ms")
        .startOf("day");
      event.start = moment
        .utc()
        .add(activeTimezone, "ms")
        .diff(startOfDayWithOffset, "seconds");
    } else {
      event.start = viewEvent.start;
    }

    if (viewEvent.durationType === "time") {
      event.end =
        event.start + parseInt(viewEvent.duration) * 3600;
    } else {
      event.end = this.getEndTimeForTemporaryOverrideEvent(event, group.events, activeTimezone);
    }

    return event;
  }

  public getFilteredUnused(parent: any, children: any[]) {
    console.log('getFilteredUnused parent: ', parent, ' children: ', children);
    let childrenHubs: string[] = [];
    _.forEach(children, (item: any) => {
      if (item && item.hubs && item.hubs.length) {
        childrenHubs = [...childrenHubs, ...item.hubs];
      }
    });
    const unusedHubs: string[] = _.filter(parent.hubs, (hub: string) => childrenHubs.indexOf(hub) === -1);
    console.log('getFilteredUnused unusedHubs: ', unusedHubs);
    return unusedHubs;
  }

  public displayHub(hub: any) {
    return (hub.toString().length === 15) ?
      parseInt(hub, 10).toString(16).toUpperCase() :
      hub;
  }
}
