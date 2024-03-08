import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { NetworkConnectivityPageRoutingModule } from './networkConnectivity-routing.module';
import { HttpClient } from '@angular/common/http';
import { NetworkConnectivityPage } from './networkConnectivity.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    NetworkConnectivityPageRoutingModule,
  ],
  exports:[NetworkConnectivityPage],
  declarations: [NetworkConnectivityPage],
  providers: [
    HttpClient,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NetworkConnectivityPageModule {}
