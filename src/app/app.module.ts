import * as Raven from 'raven-js';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Hotspot } from '@ionic-native/hotspot';

import { MomentModule } from 'angular2-moment';

import { WheelSelector } from '@ionic-native/wheel-selector';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';

import {
  CustomSelectComponent,
  CustomInputComponent,
  InputSelectComponent,
  GooglePlacesAutocompleteComponent
} from '../components/index';
import {
  SigninComponent,
  ThermostatComponent,
  OverrideComponent,
  HubComponent,
  ForgottenPasswordComponent,
  GroupCreateComponent,
  GroupingComponent
} from '../pages/index';
import {
  ApiService,
  AuthService,
  AccountService,
  GoogleService,
  GroupingService,
  HotspotService,
  PermissionService,
  UtilService
} from '../services/index';

/** Config "Sentry" raven errors logger service **/
Raven
  .config('https://afa5fddabf534b62832c6a6682afa26e@sentry.io/258024')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    /** Uncomment only for dev testing purpose **/
    console.error(err);
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [
    CustomSelectComponent,
    CustomInputComponent,
    InputSelectComponent,
    GooglePlacesAutocompleteComponent,
    ForgottenPasswordComponent,
    GroupCreateComponent,
    GroupingComponent,
    OverrideComponent,
    HubComponent,
    SigninComponent,
    ThermostatComponent,
    MyApp
  ],
  imports: [
    MomentModule,
    BrowserModule,
    CommonModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, { links: [] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CustomSelectComponent,
    CustomInputComponent,
    InputSelectComponent,
    GooglePlacesAutocompleteComponent,
    ForgottenPasswordComponent,
    GroupCreateComponent,
    GroupingComponent,
    OverrideComponent,
    HubComponent,
    SigninComponent,
    ThermostatComponent,
    MyApp
  ],
  providers: [
    GoogleMaps,
    Hotspot,
    StatusBar,
    SplashScreen,
    Toast,
    WheelSelector,
    ApiService,
    AuthService,
    AccountService,
    GoogleService,
    GroupingService,
    HotspotService,
    PermissionService,
    UtilService,
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
