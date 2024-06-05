import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CONSTANTS from './Constants';
import { map } from 'rxjs';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Router } from '@angular/router';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { AlertController } from '@ionic/angular';
import { InAppUpdate } from '@awesome-cordova-plugins/in-app-update/ngx';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';



@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  version: any;
  updateStatus: string = 'Update not started';

  constructor(
    private http: HttpClient,
    private backgroungMode: BackgroundMode,
    private appVersionNative: AppVersion,
    private router: Router,
    private market: Market,
    private alertCtrl: AlertController,
    private appUpdate: InAppUpdate,private _deploy: Deploy
  ) {}

  startBackgroundTask() {
    console.log('dskmvkl');
    this.backgroungMode.enable();
    const backgroundTask = setInterval(() => {
      this.appVersionNative
        .getVersionNumber()
        .then(async (versionNumber: any) => {
          let currentVersion: any = versionNumber;
          this.version = versionNumber;
          this.GetLatestCustomerTabletAppVersion().subscribe(
            async (res) => {
              if (currentVersion != res.appVersion) {
                this.appUpdate.update({ updateType: 'IMMEDIATE' }).subscribe(
                  () => console.log('In'),
                  (error) => console.log(error)
                );

                clearInterval(backgroundTask);
              }
            },
            async (error) => {
              this.router.navigate(['networkConnectivity']);
            }
          );
        });
    }, 5000);
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
  GetLatestCustomerTabletAppVersion() {
    return this.http
      .get<any>(
        CONSTANTS.API_ENDPOINT + 'DashBoard/GetLatestCustomerTabletAppVersion'
      )
      .pipe(
        map((member) => {
          return member;
        })
      );
  }
}
