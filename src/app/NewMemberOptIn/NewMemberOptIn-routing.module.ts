import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMemberOptInPage } from './NewMemberOptIn.page';

const routes: Routes = [
  {
    path: '',
    component: NewMemberOptInPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMemberOptInPageRoutingModule { }
