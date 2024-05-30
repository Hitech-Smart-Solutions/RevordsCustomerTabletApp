import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ActivityHistory, Model } from './model';
import { DataService } from '../data.service';
import { CountdownComponent } from 'ngx-countdown';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    CountdownComponent
  ],
  declarations: [Tab2Page],
  providers: [
    ActivityHistory,
    Model,
    DataService
  ],
})
export class Tab2PageModule {}
