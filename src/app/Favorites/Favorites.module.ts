import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './Favorites-routing.module';

import { FavoritesPage } from './Favorites.page';
import { CountdownComponent } from 'ngx-countdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    CountdownComponent
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
