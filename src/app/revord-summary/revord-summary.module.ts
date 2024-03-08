import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevordSummaryPageRoutingModule } from './revord-summary-routing.module';

import { RevordSummaryPage } from './revord-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevordSummaryPageRoutingModule
  ],
  declarations: [RevordSummaryPage]
})
export class RevordSummaryPageModule {}
