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

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  version: any;
  

  constructor(
    private http: HttpClient,
    private backgroungMode: BackgroundMode,
    private appVersionNative: AppVersion,
    private router: Router,
    private market: Market,
    private alertCtrl: AlertController,
    private appUpdate: InAppUpdate
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
