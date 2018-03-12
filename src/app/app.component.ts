import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as pages from '../pages/index';
import { GoogleService } from '../services/index';
import { ZENHQ_LOGO_TRANSPARENT } from "./constants";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public rootPage: any = pages.SigninComponent;

  public pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private app: App,
    private _google: GoogleService
  ) {
    this.pages = [
      { title: 'Grouping', component: pages.GroupingComponent },
      { title: 'Log Out', component: pages.SigninComponent }
    ];
    this.initApp();
  }

  public initApp() {
    this.platform.ready().then(() => {
      this._google.initGoogleMaps();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true);
      //this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#33000000");
      } else {
        this.statusBar.styleBlackTranslucent();
        this.statusBar.overlaysWebView(true);
      }
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        let activeView: ViewController = nav.getActive();

        if(activeView != null){
          if(nav.canGoBack()) {
            nav.pop();
          } else if (typeof activeView.instance.backButtonAction === 'function') {
            activeView.instance.backButtonAction();
          } else {
            nav.parent.select(0); // goes to the first tab
          }
        }
      });
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
