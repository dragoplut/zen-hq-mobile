// TODO: Get app version value dynamically from config
export const APP_VERSION: string = 'v1.0.7';

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

export const TEMPERATURE_UNIT: any = {
  C: 'Celsius',
  F: 'Fahrenheit'
};

export const GROUP_LEVEL: any = {
  ORGANIZATION: 1,
  REGION: 2,
  SITE: 3,
  PLACE: 4
};

export const WEEKDAYS: string[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

export const EVENT_TYPE: any = {
  LIGHTING: 'schedule-switch',
  SCHEDULE: 'schedule',
  HOLIDAY: 'holiday',
  TEMPORARY_OVERRIDE: 'temporary-override',
  DEMAND_RESPONSE: 'demand-response',
  OPEN_DEMAND_RESPONSE: 'open-demand-response'
};

export const USER_ROLE: any = {
  ADMIN: 'admin',
  NATIONAL_MANAGER: 'national-manager',
  REGIONAL_MANAGER: 'regional-manager',
  SITE_MANAGER: 'site-manager'
};

export const TIMEZONES_LIST = [
  { value: -720, viewValue: "(GMT-12:00) International Date Line West" },
  { value: -660, viewValue: "(GMT-11:00) Midway Island, Samoa" },
  { value: -600, viewValue: "(GMT-10:00) Hawaii" },
  { value: -540, viewValue: "(GMT-09:00) Alaska" },
  { value: -480, viewValue: "(GMT-08:00) Pacific Time (US and Canada); Tijuana" },
  { value: -420, viewValue: "(GMT-07:00) Mountain Time (US and Canada), Chihuahua, La Paz, Mazatlan, Arizona" },
  { value: -360, viewValue: "(GMT-06:00) Central Time (US and Canada), Central America, Saskatchewan, Guadalajara, Mexico City, Monterrey" },
  { value: -300, viewValue: "(GMT-05:00) Eastern Time (US and Canada), Indiana (East), Bogota, Lima, Quito" },
  { value: -240, viewValue: "(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz, Santiago" },
  { value: -210, viewValue: "(GMT-03:30) Newfoundland and Labrador" },
  { value: -180, viewValue: "(GMT-03:00) Brasilia, Buenos Aires, Georgetown, Greenland" },
  { value: -120, viewValue: "(GMT-02:00) Mid-Atlantic" },
  { value: -60, viewValue: "(GMT-01:00) Azores, Cape Verde Islands" },
  { value: 0, viewValue: "(GMT) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London, Casablanca, Monrovia" },
  { value: 60, viewValue: "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague, Sarajevo, Skopje, Warsaw, Zagreb, Brussels, Copenhagen, Madrid, Paris, Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna, West Central Africa" },
  { value: 120, viewValue: "(GMT+02:00) Bucharest, Cairo, Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius, Athens, Istanbul, Minsk, Jerusalem, Harare, Pretoria" },
  { value: 180, viewValue: "(GMT+03:00) Moscow, St. Petersburg, Volgograd, Kuwait, Riyadh, Nairobi, Baghdad" },
  { value: 210, viewValue: "(GMT+03:30) Tehran" },
  { value: 240, viewValue: "(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi, Yerevan" },
  { value: 270, viewValue: "(GMT+04:30) Kabul" },
  { value: 300, viewValue: "(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
  { value: 330, viewValue: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
  { value: 345, viewValue: "(GMT+05:45) Kathmandu" },
  { value: 360, viewValue: "(GMT+06:00) Astana, Dhaka, Sri Jayawardenepura, Almaty, Novosibirsk" },
  { value: 390, viewValue: "(GMT+06:30) Yangon Rangoon" },
  { value: 420, viewValue: "(GMT+07:00) Bangkok, Hanoi, Jakarta, Krasnoyarsk" },
  { value: 480, viewValue: "(GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi, Kuala Lumpur, Singapore, Taipei, Perth, Irkutsk, Ulaanbaatar" },
  { value: 540, viewValue: "(GMT+09:00) Seoul, Osaka, Sapporo, Tokyo, Yakutsk" },
  { value: 570, viewValue: "(GMT+09:30) Darwin, Adelaide" },
  { value: 600, viewValue: "(GMT+10:00) Canberra, Melbourne, Sydney, Brisbane, Hobart, Vladivostok, Guam, Port Moresby" },
  { value: 660, viewValue: "(GMT+11:00) Magadan, Solomon Islands, New Caledonia" },
  { value: 720, viewValue: "(GMT+12:00) Fiji Islands, Kamchatka, Marshall Islands, Auckland, Wellington" },
  { value: 780, viewValue: "(GMT+13:00) Nuku'alofa" }
];
