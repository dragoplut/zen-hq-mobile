// TODO: Get app version value dynamically from config
export const APP_VERSION: string = 'v1.0.2';

// tslint:disable-next-line
export const EMAIL_REGEXP: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const GOOGLE_MAP_API_URL: string = 'http://maps.google.com/maps/api/js';
export const GOOGLE_API_KEY_ANDROID: string = 'AIzaSyDJYtcVzKXghryIDmQaTBDp5gWYPbTBqfU';
export const GOOGLE_API_KEY_IOS: string = 'AIzaSyCgHpBF5TgClZPji7fl8LRfE98TnPoTWUY';

export const TABLE_UPDATE_TIMEOUT: number = 300000; // 300000 === 300 sec. === 5 min.

export const DEFAULT_ERROR_MESSAGE: string = 'Some error occurs.';
export const DEFAULT_SUCCESS_MESSAGE: string = 'Changes saved.';

export const ZENHQ_LOGO_TRANSPARENT: string = 'assets/img/zenhq-logo-transparent.png';
export const MODE_IMG_CHUNK: string = 'assets/img/circle-';

export const USER_ROLES = [
  {value: 'admin', viewValue: 'Administrator'}
];

export const APP_USER = 'app_user';
