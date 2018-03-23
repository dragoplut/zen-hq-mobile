export type T_INPUT_SELECT_PROPS = {
  modelName: string,
  placeholder: string,
  type: string,
  required: boolean,
  options?: T_SELECT_OPTION[]
};

export type T_SELECT_OPTION = {
  value: any,
  viewValue: string
};

export type T_INTERFACE_CHARACTERISTICS = {
  type?: string,
  name: string,
  service: string,
  characteristic: string,
  descriptors?: any[],
  properties: string[]
};

export type T_DEVICE_INTERFACE = {
  services: string[],
  characteristics: T_INTERFACE_CHARACTERISTICS[]
};

export type T_LOCATION_PARAMS = {
  countryName?: string,
  stateName?: string
};

export type T_BLE_NOTIFICATION_ACTIVE = {
  timestamp: any,
  address: string,
  uuid: any
};

export type T_EVENT_TEMP_OVERRIDE = {
  id?: any,
  type: string,
  mode: string,
  setpoint: number,
  durationType: string,
  start?: any,
  end?: any
};

export type T_AUTH_2_FACT = {
  email: string;
  shortcode: string
};

export type T_AUTH_CRED = {
  email: string;
  password: string
};
