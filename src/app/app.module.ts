import * as Raven from 'raven-js';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { GoogleMaps } from '@ionic-native/google-maps';

import { MomentModule } from 'angular2-moment';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
  CustomSelectComponent,
  CustomInputComponent,
  InputSelectComponent,
  GooglePlacesAutocompleteComponent
} from '../components/index';
import {
  SigninComponent,
  ForgottenPasswordComponent,
  GroupingComponent
} from '../pages/index';
import {
  ApiService,
  AuthService,
  AccountService,
  GoogleService,
  GroupingService,
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
    // console.error(err);
    Raven.captureException(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    CustomSelectComponent,
    CustomInputComponent,
    InputSelectComponent,
    GooglePlacesAutocompleteComponent,
    SigninComponent,
    ForgottenPasswordComponent,
    GroupingComponent
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
    MyApp,
    CustomSelectComponent,
    CustomInputComponent,
    InputSelectComponent,
    GooglePlacesAutocompleteComponent,
    SigninComponent,
    ForgottenPasswordComponent,
    GroupingComponent
  ],
  providers: [
    GoogleMaps,
    StatusBar,
    SplashScreen,
    ApiService,
    AuthService,
    AccountService,
    GoogleService,
    GroupingService,
    PermissionService,
    UtilService,
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
