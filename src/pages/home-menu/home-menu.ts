import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {
  ANGLE_IMG,
  ZENHQ_CLINIC_CARD,
  ZENHQ_PEN_CARD,
  ZENHQ_LOGO_TRANSPARENT,
  USER_PROFILE_IMG
} from '../../app/constants';
import { AuthService } from '../../services'

import {
  SigninComponent,
  MyAccountComponent,
  MyClinicComponent,
  MyPenComponent
} from '../index';

@Component({
  selector: 'home-menu',
  templateUrl: 'home-menu.html'
})
export class HomeMenu {

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public clinicImg: string = ZENHQ_CLINIC_CARD;
  public penImg: string = ZENHQ_PEN_CARD;
  public userProfileImg: string = USER_PROFILE_IMG;
  public angleImg: string = ANGLE_IMG;

  constructor(
    public _auth: AuthService,
    public navCtrl: NavController
  ) {

  }

  public ionViewDidLoad() {
    if (!localStorage.getItem('token_mobile')) {
      console.log('NO token found!');
      this._auth.signOut().subscribe(
        (resp: any) => {
          this.openPage(SigninComponent);
        },
        (err: any) => {
          alert(err);
        }
      );
    } else {
      console.log('Token found.');
    }
  }

  public backButtonAction() {
    this.goBack();
  }

  public goBack() {
    this.openPage(SigninComponent)
  }

  public goToPen() {
    this.openPage(MyPenComponent)
  }

  public goToClinic() {
    this.openPage(MyClinicComponent)
  }

  public goToProfile() {
    this.openPage(MyAccountComponent)
  }

  public openPage(page) {
    this.navCtrl.push(page);
  }
}
