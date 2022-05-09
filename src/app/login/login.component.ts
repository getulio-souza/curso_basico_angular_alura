import { PropertiesService } from '@alis/ng-services';
import { MESSAGE_TYPE, SimpleNotificationService } from '@alis/proxper-base';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BootstrapModalHelper } from '../shared/bootstrap-modal-helper';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserActivityService } from '../shared/services/user-activity.service';
import { version } from '../../../package.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('registryForm', { static: true }) controlForm: NgForm;

  user: string;
  password: string;

  logo: string;
  background: string;

  forgotPasswordPopupOpen = false;
  email: string;
  pjson: string = version;

  externalLogin = PropertiesService.properties? PropertiesService.properties.loginExternal : false;

  @ViewChild('emailForm', { static: true }) emailForm: NgForm;
  firstLogin: boolean;
  confirmPassword: string;
  notMatch: boolean;
  weakPassword: boolean;
  newPassword: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sns: SimpleNotificationService,
    private translateService: TranslateService,
    private userActivityService: UserActivityService
  ) { } 

  ngOnInit() {}

  ngAfterViewInit() {}

  doLogin() {
    if (!this.externalLogin) {
      this.loginInternal(this.user, this.password);
    } else {
      this.loginExternal(this.user, this.password);
    }
  }

  loginExternal(user: string, password: string): void {
    this.authenticationService
      .authenticateExternalLogin(user, password)
      .subscribe(
        () => {
          this.loginInternal(
            user,
            PropertiesService.properties.defaultPasswordIntegration
          );
        },
        (err) => {
          console.log(err);
          const origin = this.externalLogin ? 'PROXPER: ' : '';
          if (err.error != null && err.error.error == 'invalid_grant') {
            this.sns.showSingleMessage(
              MESSAGE_TYPE.ERROR,
              this.translate('Username or password invalid'),
              null,
              false
            );
          } else {
            this.sns.showSingleMessage(
              MESSAGE_TYPE.ERROR,
              this.translate('Error connecting to login server'),
              null,
              false
            );
          }
        }
      );
  }

  loginInternal(user: string, password: string): void {
    this.authenticationService.authenticate('admin', 'password').subscribe(
      async() => {
        // await this.userActivityService.createActivity({context:'health-backoffice', activity:'login'}).toPromise();
        this.checkFirstLogin();
      },
      (err) => {
        console.log(err);
        if (err.error != null && err.error.error == 'invalid_grant') {
          const origin = this.externalLogin ? 'PROXPER: ' : '';
          this.sns.showSingleMessage(
            MESSAGE_TYPE.ERROR,
            this.translate(origin + 'Username or password invalid'),
            null,
            false
          );
        } else {
          this.sns.showSingleMessage(
            MESSAGE_TYPE.ERROR,
            this.translate(origin + 'Error connecting to login server'),
            null,
            false
          );
        }
      }
    );
  }

  checkFirstLogin() {
    let firstLogin = this.authenticationService.getFirstLogin();
    this.notMatch = false;
    this.weakPassword = false;

    let strongPassword = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );

    if (firstLogin) {
      this.firstLogin = true;
      this.newPassword !== this.confirmPassword;

      if (!strongPassword.test(this.newPassword)) {
        this.weakPassword = true;
        return;
      } else if (this.newPassword !== this.confirmPassword) {
        this.notMatch = true;
        return;
      } else {
        this.notMatch = false;
        this.weakPassword = false;

        this.authenticationService.forgotPasswordChangePassword(
          null,
          this.newPassword
        );

        this.sns.showSingleMessage(
          MESSAGE_TYPE.SUCCESS,
          this.translate('Login successful'),
          null,
          false
        );

        let url = this.activatedRoute.snapshot.queryParamMap.get('url');
        if (url == null) {
          this.router.navigate(['/selectProperty']);
        } else {
          this.router.navigateByUrl(url);
        }
      }
    } else {
      this.sns.showSingleMessage(
        MESSAGE_TYPE.SUCCESS,
        this.translate('Login successful'),
        null,
        false
      );

      let url = this.activatedRoute.snapshot.queryParamMap.get('url');
      if (url == null) {
        this.router.navigate(['/selectProperty']);
      } else {
        this.router.navigateByUrl(url);
      }
    }
  }

  openPopupForgotPassword() {
    BootstrapModalHelper.open('forgotPasswordModal');
  }

  doForgotPassword() {
    if (this.emailForm.valid) {
      this.authenticationService.forgotPassword(this.email, '/login').subscribe(
        () => {
          BootstrapModalHelper.hide('forgotPasswordModal');
          this.sns.showSingleMessage(
            MESSAGE_TYPE.SUCCESS,
            this.translate(
              'If your address was registered, an e-mail was sent with instructions'
            ),
            null,
            false
          );
        },
        (err) => {
          this.sns.showSingleMessage(
            MESSAGE_TYPE.ERROR,
            this.translate('Error trying to reset password'),
            null,
            false
          );
        }
      );
    }
  }

  translate(key: string) {
    let keyTranslated;

    this.translateService.get(key).subscribe((res) => {
      keyTranslated = res;
    });

    return keyTranslated;
  }
}
