import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { GetMemberProfileService } from './api/services/get-member-profile.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityHistory, MembersVistLog, Model } from './tab2/model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from './api/model';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { BackgroundService } from './api/services/backgroundService';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { InAppUpdate } from '@awesome-cordova-plugins/in-app-update/ngx';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Deploy,
    GetMemberProfileService,
    Model,
    MembersVistLog,
    ActivityHistory,
    User,
    AppVersion,    
    BackgroundMode,
    BackgroundService,
    Market,
    InAppUpdate
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
