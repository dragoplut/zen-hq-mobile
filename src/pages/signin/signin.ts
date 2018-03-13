import { Component, ViewChild, OnInit } from '@angular/core';
import {
  AuthService,
  ApiService,
  AccountService,
  PermissionService
} from '../../services/index';
import {
  DEFAULT_ERROR_MESSAGE,
  ZENHQ_LOGO_TRANSPARENT,
  EMAIL_REGEXP
} from '../../app/constants';
import { GroupingComponent, ForgottenPasswordComponent } from '../index';
import { MenuController, Nav, NavController } from 'ionic-angular';

@Component({
  selector: 'signin',
  templateUrl: `./signin.html`
})
export class SigninComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;

  public user: any = { email: '', password: '' };
  public token: string = '';
  public logoTransparent: string = ZENHQ_LOGO_TRANSPARENT;
  public loading: boolean = false;
  public errorMessage: any = '';

  public emailRegExp: any = EMAIL_REGEXP;

  // TODO: Remove signin page blocker for prod
  public approved: boolean = false;
  public pwd: any = '';

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public _api: ApiService,
    public _auth: AuthService,
    public _account: AccountService,
    public _permission: PermissionService
  ) {
    this.menu.enable(false, 'appMenu');
  }

  public ionViewDidLoad() {
    localStorage.removeItem('token_mobile');
    this.user.email = localStorage.getItem('lastEmail') || '';
  }

  public ngOnInit() {
    this._api.setHeaders({});
  }

  public showErrorMessage(message?: string) {
    this.errorMessage = message ? message : DEFAULT_ERROR_MESSAGE;
  }

  public goToReset() {
    this.openPage(ForgottenPasswordComponent);
    // this.loading = true;
    // if (this.user.email && !this.validateItem('email')) {
    //   this._auth.resetPassword(this.user.email).subscribe(
    //     (resp: any) => {
    //       this.loading = false;
    //       this.openPage(ForgottenPasswordComponent);
    //     },
    //     (err: any) => {
    //       this.loading = false;
    //       alert(err);
    //     }
    //   );
    // } else if (!this.user.email) {
    //   this.loading = false;
    //   this.user.email = ' ';
    // }
  }

  public clearError() {
    this.errorMessage = '';
  }

  public validateItem(field: string) {
    let errMessage: string = '';

    switch (field) {
      case 'email':
        errMessage = !this.emailRegExp.test(this.user.email) && this.user.email ?
          'Email is invalid' : '';
        break;
      case 'password':
        errMessage = !this.user.password || this.user.password.length < 4 ?
          'Min length is 4 characters' : '';
        break;
      default:
        break;
    }

    return errMessage;
  }

  public handleSuccess(resp: any) {
    this.loading = false;
    if (resp) {
      this.openPage(GroupingComponent);
    } else {
      const message: string = 'You are not allowed to sign in!';
      this.showErrorMessage(message);
    }
    return resp;
  }

  public handleErr(err: any) {
    this.loading = false;
    const message = err && err._body ?
      JSON.parse(err._body) : { error: { message: DEFAULT_ERROR_MESSAGE } };
    this.showErrorMessage(message.error.message);
    return err && err._body ? JSON.parse(err._body) : message;
  }

  public authenticate() {
    this.loading = true;
    localStorage.setItem('lastEmail', this.user.email);
    this._auth.authenticate(this.user)
      .subscribe(
        (resp: any) => this.handleSuccess(resp),
        (err: any) => this.handleErr(err)
      );
    // this._auth.generateToken(this.user)
    //   .subscribe(
    //     (resp: any) => this.getUserData(),
    //     (err: any) => this.handleErr(err)
    //   );
  }

  // public getUserData() {
  //   this._account.getAccountInfo().subscribe(
  //     (resp: any) => this.handleSuccess(resp),
  //     (err: any) => this.handleErr(err)
  //   );
  // }

  public openPage(page) {
    this.navCtrl.push(page, { email: this.user.email });
  }
}
