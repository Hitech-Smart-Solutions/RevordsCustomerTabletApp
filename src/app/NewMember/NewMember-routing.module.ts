import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMemberPage } from './NewMember.page';

const routes: Routes = [
  {
    path: '',
    component: NewMemberPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMemberPageRoutingModule { }
