import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CONSTANTS from './Constants';
import { map } from 'rxjs';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Router } from '@angular/router';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {
	version: any;
    constructor(private http: HttpClient, private backgroungMode: BackgroundMode,
        private appVersionNative: AppVersion, private router: Router,
        private market: Market, private alertCtrl: AlertController) { }

    startBackgroundTask() {
        this.backgroungMode.enable();
        const backgroundTask = setInterval(() => {
            this.appVersionNative.getVersionNumber().then(async (versionNumber: any) => {
                let currentVersion: any = versionNumber;
                this.version = versionNumber;
                this.GetLatestCustomerTabletAppVersion().subscribe(async (res) => {
                    if (currentVersion != res.appVersion) {

                        // const alert = await this.alertCtrl.create({
                        //     header: 'New Release!',
                        //     message: 'Update Revords Customer to continue..',
                        //     buttons: ['Update'],
                        //     backdropDismiss: false
                        // });
                        // await alert.present();

                        // const result = (await alert.onDidDismiss().then((res) => {
                        //     if (res.role == undefined) {
                        //         this.market.open("com.customerrevords.app").then(async (res) => {
                        //             console.log(res);
                        //         });
                        //     }
                        // }));
                        clearInterval(backgroundTask);
                        // this.router.navigate(['update']);
                    }
                    // else {
                    //     clearInterval(backgroundTask);
                    // }
                },
                    async (error) => {
                        this.router.navigate(['networkConnectivity']);
                        // clearInterval(backgroundTask);
                    });
            });
        }, 5000);
    }

    GetLatestCustomerTabletAppVersion() {
        return this.http.get<any>(CONSTANTS.API_ENDPOINT + "DashBoard/GetLatestCustomerTabletAppVersion")
            .pipe(map(member => {
                return member;
            }));
    }
}