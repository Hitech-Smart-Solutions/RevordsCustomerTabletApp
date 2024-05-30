import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerDetailsPageRoutingModule } from './customer-details-routing.module';
import { CustomerDetailsPage } from './customer-details.page';
import { CountdownComponent } from 'ngx-countdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerDetailsPageRoutingModule,
    CountdownComponent
  ],
  declarations: [CustomerDetailsPage]
})
export class CustomerDetailsPageModule {}
