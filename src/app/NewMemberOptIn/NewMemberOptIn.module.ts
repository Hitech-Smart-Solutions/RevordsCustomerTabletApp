import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewMemberOptInPage } from './NewMemberOptIn.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NewMemberOptInPageRoutingModule } from './NewMemberOptIn-routing.module';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MembersVistLog, Model } from '../tab2/model';
import { CountdownComponent } from 'ngx-countdown';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    NewMemberOptInPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CountdownComponent
  ],
  declarations: [NewMemberOptInPage],
  providers: [
    GetMemberProfileService,
    HttpClient,
    Model,
    MembersVistLog
  ],
})
export class NewMemberOptInPageModule {}
