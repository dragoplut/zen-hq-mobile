import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService, ApiService, PermissionService } from '../../services/index';
import {
  ANGLE_IMG, EMAIL_REGEXP,
  ZENHQ_LOGO_TRANSPARENT
} from '../../app/constants';
import { SigninComponent } from '../index';
import { Nav, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'forgotten-password',
  templateUrl: `./forgotten-password.html`
})
export class ForgottenPasswordComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;

  public emailRegExp: any = EMAIL_REGEXP;

  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public angleImg: string = ANGLE_IMG;

  public email: string = '';
  public emailResent: boolean = false;
  public newPasswordSent: boolean = false;
  public loading: boolean = false;
  public user: any = { email: '' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _api: ApiService,
    public _auth: AuthService,
    public _permission: PermissionService
  ) {}

  public ionViewDidLoad() {
    this.email = this.navParams.get('email');
    this.newPasswordSent = false;
  }

  public ngOnInit() {
    this._api.setHeaders({});
  }

  public resendEmail() {
    this._auth.resetPassword(this.email).subscribe(
      (resp: any) => {
        this.emailResent = true;
      },
      (err: any) => {
        console.log('err: ', err);
      }
    );

    console.log('resendEmail');
  }

  public goBack() {
    this.openPage(SigninComponent);
  }

  public goToSignin() {
    console.log('goToSignin');
    this.openPage(SigninComponent);
  }

  public sendNewPassword() {
    if (!this.validateItem('email')) {
      this.loading = true;
      this._auth.resetPassword(this.user.email).subscribe(
        (resp: any) => {
          this.loading = false;
          this.newPasswordSent = true;
        },
        (err: any) => {
          this.loading = false;
          alert(err);
        }
      );
    }
  }

  public openPage(page) {
    this.navCtrl.push(page);
  }

  public validateItem(field: string) {
    let errMessage: string = '';

    switch (field) {
      case 'email':
        errMessage = !this.emailRegExp.test(this.user.email) && this.user.email ?
          'Email is invalid' : '';
        break;
      default:
        break;
    }

    return errMessage;
  }
}
