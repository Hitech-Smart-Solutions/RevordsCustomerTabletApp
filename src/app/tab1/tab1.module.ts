import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MembersVistLog, Model } from '../tab2/model';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    HttpClientModule
  ],
  declarations: [Tab1Page],
  providers: [
    GetMemberProfileService,
    HttpClient,
    Model,
    MembersVistLog
  ],
})
export class Tab1PageModule {}
