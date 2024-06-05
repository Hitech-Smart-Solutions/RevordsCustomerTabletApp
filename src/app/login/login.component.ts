import { Component, OnInit } from '@angular/core';
import { User } from '../api/model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import * as CONSTANTS from '../api/services/Constants';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  Email: any;
  Password: any;
  userData: any;
  showLoginForm: boolean = false;
  isLoadingMember = false;
  updateStatus: string = 'Update not started';
  constructor(
    private user: User,
    private router: Router,
    private toastCtrl: ToastController,
    private memberService: GetMemberProfileService,private _deploy: Deploy
  ) {}

  ngOnInit() {
    this.performManualUpdate();
  }
  async performManualUpdate() {
    this.updateStatus = 'Checking for Update';
    const update = await this._deploy.checkForUpdate()
    if (update.available){
      this.updateStatus = 'Update found. Downloading update';
      await this._deploy.downloadUpdate((progress) => {
        console.log(progress);
      })
      this.updateStatus = 'Update downloaded. Extracting update';
      await this._deploy.extractUpdate((progress) => {
        console.log(progress);
      })
      console.log('Reloading app');
      this.updateStatus = 'Update extracted. Reloading app';
      await this._deploy.reloadApp();
    } else {
      console.log('No update available');
      this.updateStatus = 'No update available';
    }
   }
  signUp() {
    this.showLoginForm = true;
    this.isLoadingMember = true;
    this.memberService.Users(this.Email, this.Password).subscribe(
      (data: any) => {
        this.userData = data;

        if (
          this.userData != '' &&
          this.userData != null &&
          this.userData != undefined
        ) {
          this.user.businessLocationId =
            this.userData.business[0].businessLocationId;
          this.user.businessGroupId = this.userData.businessGroupId;
          this.user.businessGroupName = this.userData.businessGroupName;
          this.user.businessGroupImage = this.userData.businessGroupImage;
          this.user.businessLocationLatitude =
            this.userData.businessLocationLatitude;
          this.user.businessLocationLongitude =
            this.userData.businessLocationLongitude;
          this.user.sourceId = this.userData.business[0].sourceId;
          this.user.sourceName = this.userData.business[0].sourceName;
          this.user.IsAgeRestriction =
            this.userData.business[0].isAgeRestriction;
        }

        localStorage.setItem(
          'businessLocationId',
          String(this.user.businessLocationId)
        );
        localStorage.setItem(
          'businessGroupId',
          String(this.user.businessGroupId)
        );
        localStorage.setItem(
          'businessGroupImage',
          String(this.user.businessGroupImage)
        );
        localStorage.setItem(
          'businessLocationLatitude',
          String(this.user.businessLocationLatitude)
        );
        localStorage.setItem(
          'businessLocationLongitude',
          String(this.user.businessLocationLongitude)
        );
        localStorage.setItem('sourceId', String(this.user.sourceId));
        localStorage.setItem(
          'businessGroupName',
          String(this.user.businessGroupName)
        );
        localStorage.setItem('sourceName', String(this.user.sourceName));

        this.isLoadingMember = false;
        this.router.navigate(['tab1']);
        this.showLoginForm = false;
      },
      async (error: any) => {
        if (error.status == 404) {
          this.memberService.toastMessage(
            'Please enter valid credentials.',
            2500,
            'custom-toastDanger'
          );
        } else {
          this.memberService.toastMessage(
            'Something went wrong. Please try again.',
            2500,
            'custom-toast'
          );
        }

        this.isLoadingMember = false;
        this.showLoginForm = false;
      }
    );
  }
}
