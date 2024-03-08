import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkConnectivityPage } from './networkConnectivity.page';

const routes: Routes = [
  {
    path: '',
    component: NetworkConnectivityPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkConnectivityPageRoutingModule {}
