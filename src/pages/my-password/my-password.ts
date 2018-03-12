import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  ANGLE_IMG,
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';
import { AuthService } from '../../services/index';
import { MyAccountComponent } from '../index';

@Component({
  selector: 'my-password',
  templateUrl: 'my-password.html'
})
export class MyPasswordComponent {

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public angleImg: string = ANGLE_IMG;
  public user: any = {};
  public errorMessages: any = {};
  public formValid: boolean = false;

  public passwordInputs: any = [
    { modelName: 'currentPassword', placeholder: 'Existing Password', type: 'password', required: true },
    { modelName: 'newPassword', placeholder: 'New Password', type: 'password', required: true },
    { modelName: 'confirmPassword', placeholder: 'Confirm Password', type: 'password', required: true }
  ];

  constructor(
    public _auth: AuthService,
    public navCtrl: NavController
  ) {}

  public save() {
    if (this.user &&
      this.user.currentPassword &&
      this.user.newPassword &&
      this.user.confirmPassword &&
      this.user.newPassword === this.user.confirmPassword
    ) {
      this.errorMessages = {};
      this._auth.changePassword(this.user).subscribe(
        (resp: any) => {
          if (resp && resp.error && resp.error.message) {
            if (resp.error.message === 'Incorrect password.') {
              this.errorMessages = {
                currentPassword: resp.error.message
              };
            } else {
              this.errorMessages.newPassword = resp.error.message;
            }
          } else {
            this.openPage(MyAccountComponent);
          }
        },
        (err: any) => {
          console.log('err: ', err);
          this.openPage(MyAccountComponent);
        }
      );
    }
  }

  public onItemChange() {
    if (!this.user.currentPassword ||
      !this.user.newPassword ||
      !this.user.confirmPassword)
    {
      this.errorMessages.currentPassword = !this.user.currentPassword ?
        'Error. Please provide old password!' : '';
      this.errorMessages.newPassword = !this.user.newPassword ?
        'Error. Please provide new password!' : '';
      this.errorMessages.confirmPassword = !this.user.confirmPassword ?
        'Error. Please provide confirm password!' : '';
      this.formValid = false;
    }
    if (this.user && this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessages.confirmPassword = 'Error. Confirm password do not match!';
      this.formValid = false;
    }
    if (this.user &&
      this.user.currentPassword &&
      this.user.newPassword &&
      this.user.confirmPassword &&
      this.user.newPassword === this.user.confirmPassword
    ) {
      this.errorMessages = {};
      this.formValid = true;
    }
  }

  public goBack() {
    this.openPage(MyAccountComponent);
  }

  public openPage(page) {
    this.navCtrl.push(page);
  }
}
