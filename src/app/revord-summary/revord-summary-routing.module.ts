import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevordSummaryPage } from './revord-summary.page';

const routes: Routes = [
  {
    path: '',
    component: RevordSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevordSummaryPageRoutingModule {}
